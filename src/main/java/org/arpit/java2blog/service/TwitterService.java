package org.arpit.java2blog.service;

import java.sql.Blob;
import java.sql.Connection;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.spacenine.twitter.AutoTweetGenerator;
import com.spacenine.twitter.EncodingUtil;
import com.spacenine.twitter.TwitterHashtagManipulator;
import com.spacenine.twitter.TwitterUtil;
import com.spacenine.twitter.Util;

import org.arpit.java2blog.bean.CompleteTweet;
import org.arpit.java2blog.bean.Mention;
import org.arpit.java2blog.bean.SingleTweet;
import org.arpit.java2blog.bean.Tweet;
import org.arpit.java2blog.bean.TweetBox;
import org.arpit.java2blog.bean.TweetPiece;
import org.arpit.java2blog.bean.TwitterUser;

import javafx.beans.property.ReadOnlyBooleanProperty;

public class TwitterService {

	public Connection con = null;

	private static boolean isServerLoadedFirstTime = false;

	public TwitterService() {

		String url = "jdbc:mysql://localhost:3306/" + TwitterUtil.mySqlDbName + "?autoReconnect=true&useSSL=false";

		try {
//			Class.forName("com.jdbc.jdbc.Driver");

//			Class.forName("com.mysql.jdbc.Driver");
			Class.forName("com.mysql.cj.jdbc.Driver");
//			Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
			con = DriverManager.getConnection(url, TwitterUtil.mySqlUserName, TwitterUtil.mySqlPassword);

		} catch (Exception e) {
			System.out.println("con init: " + e);
		}

		if (isServerLoadedFirstTime)
			return;
		
		isServerLoadedFirstTime = true;
		new TwitterHashtagManipulator(this).start();
        new AutoTweetGenerator(this).start();

	}


	private boolean areUsersRelated(int from_user_id, int to_user_id) {

		if (from_user_id == to_user_id)
			return true;

		try {

			String query = "SELECT COUNT(*) FROM " + TwitterUtil.user_rel_table + " WHERE from_user=" + from_user_id + " AND to_user=" + to_user_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next())
				return rs.getInt(1) == 1;

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return true;
	}

	public boolean relateUsers(int from_user_id, int to_user_id) {

		if (this.areUsersRelated(from_user_id, to_user_id))
			return false;

		try {

			String query = "INSERT INTO " + TwitterUtil.user_rel_table + " VALUES(?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, from_user_id);
			st.setInt(2, to_user_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return true;
	}


	private Tweet getTweetFromResultSet(ResultSet rs) {

		Tweet tweet = null;

		try {
			tweet = new Tweet(rs.getInt(1), rs.getInt(2), rs.getString(3), rs.getInt(4), rs.getInt(5), rs.getInt(6),
					rs.getTimestamp(7), rs.getInt(8), rs.getInt(9));
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return tweet;
	}

	public boolean isUserRegistered(int id) {

		boolean ans = false;

		try {

			String query = "SELECT * FROM " + TwitterUtil.userTable + " WHERE id=" + id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			ans = rs.next();

		} catch (Exception e) {
			System.out.println("isUserRegistered: " + e);
		}

		return ans;

	}

	public boolean isUserRegistered(String userName, String password) {

		int count = 0;

		try {

			String query = "SELECT COUNT(*) FROM " + TwitterUtil.userTable + " WHERE user_name=? AND password=?";

			PreparedStatement ps = con.prepareStatement(query);

			ps.setString(1, userName);
			ps.setString(2, password);

			ResultSet resultSet = ps.executeQuery();

			if (resultSet.next())
				count = resultSet.getInt(1);

		} catch (Exception e) {
			System.out.println("isUserRegistered: " + e);
		}

		return count == 1;

	}

	public TwitterUser addUser(TwitterUser user) {

		try {

			String query = "INSERT INTO " + TwitterUtil.userTable
					+ " (user_name, password, age, gender, phone, email, status, total_tweets, total_followers, total_followees, mention_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setString(1, user.getUser_name());
			st.setString(2, user.getPassword());
			st.setInt(3, user.getAge());
			st.setString(4, user.getGender());
			st.setString(5, user.getPhone());
			st.setString(6, user.getEmail());
			st.setString(7, user.getStatus());
			st.setInt(8, user.getTotal_tweets());
			st.setInt(9, user.getTotal_followers());
			st.setInt(10, user.getTotal_followees());
			st.setString(11, user.getMention_name());

			st.executeUpdate();

			PreparedStatement st1 = con.prepareStatement("SELECT LAST_INSERT_ID() as id;");

			ResultSet result1 = st1.executeQuery();
			if (result1.next()) {
				user.setId(result1.getInt("id"));
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		// ADDS USER IN mention_trend_table
		try {

			String query = "INSERT INTO " + TwitterUtil.mention_trend_table + " (user_id) VALUES (?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, user.getId());

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}


		return user;

	}

	public TwitterUser getUser(int id) {

		TwitterUser user = null;

		try {

			String query = "SELECT * FROM " + TwitterUtil.userTable + " WHERE id=" + id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next())
				user = getUserFromResultSet(rs);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return user;

	}

	public TwitterUser updateUser(TwitterUser user) {

		try {

			String query = "UPDATE " + TwitterUtil.userTable
					+ " SET user_name=?, password=?, age=?, gender=?, phone=?, email=?, status=?, total_tweets=?, total_followers=?, total_followees=?, mention_name=? WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setString(1, user.getUser_name());
			st.setString(2, user.getPassword());
			st.setInt(3, user.getAge());
			st.setString(4, user.getGender());
			st.setString(5, user.getPhone());
			st.setString(6, user.getEmail());
			st.setString(7, user.getStatus());
			st.setInt(8, user.getTotal_tweets());
			st.setInt(9, user.getTotal_followers());
			st.setInt(10, user.getTotal_followees());
			st.setString(11, user.getMention_name());
			st.setInt(12, user.getId());

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return user;

	}

	public void deleteUser(int id) {

		try {

			String query = "DELETE FROM " + TwitterUtil.userTable + " WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);
			st.setInt(1, id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public String getStatus(int user_id) {

		try {

			String query = "SELECT status FROM " + TwitterUtil.userTable + " WHERE id=" + user_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next())
				return rs.getString(1);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;

	}

	public String updateStatus(int user_id, String newStatus) {

		// Delete status-hash mapping
		try {
	
			String query = "DELETE FROM " + TwitterUtil.status_hash_table + " WHERE user_id=" + user_id;
			
			Statement st = con.createStatement();
			st.execute(query);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		// Delete status-mention mapping
		try {
			String query = "DELETE FROM " + TwitterUtil.status_mention_table + " WHERE user_id=" + user_id;
			
			Statement st = con.createStatement();
			st.execute(query);
		} catch (SQLException e) {
			e.printStackTrace();
		}

		int mention_id;
		Set<String> hashtags = new HashSet<>();
		Set<Integer> mentions = new HashSet<>();
		for (String word: newStatus.split(" "))
			if (word.charAt(0) == '#' && !hashtags.contains(word.substring(1))) {

				String hashtag = word.substring(1);
				
				int hash_id = addHashtag(hashtag);

				try {

					String query = "INSERT INTO " + TwitterUtil.status_hash_table + " VALUES(?, ?)";
					PreparedStatement st = con.prepareStatement(query);
					
					st.setInt(1, user_id);
					st.setInt(2, hash_id);
					
					st.executeUpdate();
					
				} catch (SQLException e) {
					e.printStackTrace();
				}

				hashtags.add(hashtag);

			} else if (~(mention_id = Util.getMentionId(word)) != 0 && mention_id != user_id && !mentions.contains(mention_id)) {

				try {

					String query = "INSERT INTO " + TwitterUtil.status_mention_table + " VALUES(?, ?)";
					PreparedStatement st = con.prepareStatement(query);
					
					st.setInt(1, user_id);
					st.setInt(2, mention_id);
					
					st.executeUpdate();
					
				} catch (SQLException e) {
					e.printStackTrace();
				}

				mentions.add(mention_id);
				
			}
		
		// Relating Users in Mentions
		for (Integer mention_id0: mentions)
			relateUsers(user_id, mention_id0);
		
		try {

			String query = "UPDATE " + TwitterUtil.userTable + " SET status=? WHERE id=?";
			
			PreparedStatement st = con.prepareStatement(query);

			st.setString(1, newStatus);
			st.setInt(2, user_id);

			st.executeUpdate();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return newStatus;
		
	}
	

	public Tweet addTweet(Tweet tweet) {

		if (!isUserRegistered(tweet.getUser_id()))
			return null;
		
		try {

			String query = "INSERT INTO " + TwitterUtil.tweetTable + "(user_id, quote, source_label, who_can_reply) VALUES (?, ?, ?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, tweet.getUser_id());
			st.setString(2, tweet.getQuote());
			st.setInt(3, tweet.getSource_label());
			st.setInt(4, tweet.getWho_can_reply());

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		tweet = lastTweetOf(tweet.getUser_id());
		
		mapTweetAndHashtags(tweet);
		mapTweetAndMentions(tweet);
		incrementTotalTweets(tweet.getUser_id(), 1);
		
		return tweet;

	}

	public Tweet deleteTweet(Tweet tweet) {

		unmapTweetAndHashtags(tweet);
		unmapTweetAndMentions(tweet);
		incrementTotalTweets(tweet.getUser_id(), -1);

		try {

			String query = "DELETE FROM " + TwitterUtil.tweetTable + " WHERE id=" + tweet.getId();

			Statement st = con.createStatement();
			st.execute(query);

			return tweet;

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;
	}


	public List<Tweet> getTweetsForCustomQuery(String query) {

		List<Tweet> tweets = new ArrayList<Tweet>();

		try {

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				tweets.add(getTweetFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return tweets;
	}
	
	public int getUserIdFromMentionName(String mention) {

		try {

			String query = "SELECT id FROM " + TwitterUtil.userTable + " WHERE mention_name='" + mention + "'";

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next())
				return rs.getInt(1);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return -1;
	}


	public void mapTweetAndMentions(Tweet tweet) {

		try {
			
			for (Integer mention: tweet.getMentions()) {
				
				String query = "INSERT INTO " + TwitterUtil.mention_tweet_table + " VALUES(?, ?)";

				PreparedStatement st = con.prepareStatement(query);

				st.setInt(1, mention);
				st.setInt(2, tweet.getId());

				st.executeUpdate();


				this.relateUsers(tweet.getUser_id(), mention);
				
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	public void unmapTweetAndMentions(Tweet tweet) {

		try {

			String query = "DELETE FROM " + TwitterUtil.mention_tweet_table + " WHERE tweet_id=" + tweet.getId();

			Statement st = con.createStatement();
			st.execute(query);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void mapTweetAndHashtags(Tweet tweet) {
		
		try {
			
			for (String hashtag: tweet.getHashtags()) {
				
				hashtag = hashtag.substring(1);
				
				String query = "INSERT INTO " + TwitterUtil.hash_tweet_table + " VALUES(?, ?)";

				PreparedStatement st = con.prepareStatement(query);

				st.setInt(1, addHashtag(hashtag));
				st.setInt(2, tweet.getId());

				st.executeUpdate();
				
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	public void unmapTweetAndHashtags(Tweet tweet) {

		try {

			String query = "DELETE FROM " + TwitterUtil.hash_tweet_table + " WHERE tweet_id=" + tweet.getId();

			Statement st = con.createStatement();
			st.execute(query);

		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	

	private int getHashtagId(String hashtag) {
		
		int ans = 0;
		
		try {
			
			String query = "SELECT id FROM " + TwitterUtil.hashtagsTable + " WHERE hashtag='" + hashtag + "'";

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			if (rs.next())
				ans = rs.getInt(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;
	}
	
	private int addHashtag(String hashtag) {
		
		int ans = getHashtagId(hashtag);
		
//		INSERT INTO hash_table(hashtag) SELECT @x WHERE NOT EXISTS (SELECT hashtag FROM hash_table WHERE hashtag=@x);
		
		if (ans != 0)
			return ans;
		
		try {
			
			String query = "INSERT INTO " + TwitterUtil.hashtagsTable + "(hashtag) VALUES (?)";
			
			PreparedStatement st = con.prepareStatement(query);
			
			st.setString(1, hashtag);
			
			st.executeUpdate();
			
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return getHashtagId(hashtag);
		
	}

	private Tweet lastTweetOf(int user_id) {

		Tweet tweet = new Tweet();

		try {

			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE user_id=" + user_id
					+ " ORDER BY id DESC LIMIT 1";

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next()) {
				tweet.setId(rs.getInt(1));
				tweet.setUser_id(rs.getInt(2));
				tweet.setQuote(rs.getString(3));
				tweet.setTotal_likes(rs.getInt(4));
				tweet.setTotal_retweets(rs.getInt(5));
				tweet.setTotal_replies(rs.getInt(6));
				tweet.setCreated_at(rs.getTimestamp(7));
				tweet.setSource_label(rs.getInt(8));
				tweet.setWho_can_reply(rs.getInt(9));
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return tweet;

	}
	
	private void incrementTotalTweets(int user_id, int value) {
		
		try {
			
			String query = "UPDATE " + TwitterUtil.userTable + " SET total_tweets = total_tweets + ? WHERE id=?";
			
			PreparedStatement st = con.prepareStatement(query);
			
			st.setInt(1, value);
			st.setInt(2, user_id);
			
			st.executeUpdate();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	public List<Tweet> getTweetsOfUserId(int user_id) {

		List<Tweet> tweets = new ArrayList<Tweet>();

		try {

			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE user_id=" + user_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				tweets.add(getTweetFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return tweets;

	}

	public Tweet addRetweet(int parent_tweet_id, Tweet retweet) {

		if (!doesTweetExists(parent_tweet_id))
			return null;

		retweet = this.addTweet(retweet);

		if (retweet == null)
			return null;
		
		this.incrementRetweet(parent_tweet_id, 1);
		this.relateUsers(retweet.getUser_id(), getUserIdOfTweet(parent_tweet_id));

		try {

			String query = "INSERT INTO " + TwitterUtil.retweetTable + " VALUES (?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, parent_tweet_id);
			st.setInt(2, retweet.getId());

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return retweet;
	}

	public Tweet undoRetweet(int parent_tweet_id, int user_id) {

		if (!doesTweetExists(parent_tweet_id))
			return null;

		Tweet child_tweet = this.getChildTweetForRetweetBy(parent_tweet_id, user_id);

		if (child_tweet == null)
			return null;

		try {

			String query = "DELETE FROM " + TwitterUtil.retweetTable + " WHERE retweet_id=" + child_tweet.getId();

			Statement st = con.createStatement();
      		st.execute(query);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		this.incrementRetweet(parent_tweet_id, -1);
		this.deleteTweet(child_tweet);

		return child_tweet;

	}

	private Tweet getChildTweetForRetweetBy(int parent_tweet_id, int user_id) {
		
		try {

			String subquery = "SELECT retweet_id FROM " + TwitterUtil.retweetTable + " WHERE tweet_id=" + parent_tweet_id;
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id IN (" + subquery + ") AND quote IS NULL AND user_id=" + user_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next())
				return getTweetFromResultSet(rs);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return null;

	}


	private void incrementRetweet(int tweet_id, int value) {

		try {

			String query = "UPDATE " + TwitterUtil.tweetTable + " SET total_retweets = total_retweets + ? WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, value);
			st.setInt(2, tweet_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public Tweet addReplyTweet(int parent_tweet_id, Tweet replyTweet) {

		if (!doesTweetExists(parent_tweet_id))
			return null;

		replyTweet = this.addTweet(replyTweet);

		if (replyTweet == null)
			return null;

		this.incrementReplyTweet(parent_tweet_id, 1);
		this.relateUsers(replyTweet.getUser_id(), getUserIdOfTweet(parent_tweet_id));

		try {

			String query = "INSERT INTO " + TwitterUtil.replyTable + " VALUES (?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, parent_tweet_id);
			st.setInt(2, replyTweet.getId());

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return replyTweet;

	}

	private void incrementReplyTweet(int tweet_id, int value) {

		try {

			String query = "UPDATE " + TwitterUtil.tweetTable + " SET total_replies = total_replies + ? WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, value);
			st.setInt(2, tweet_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	private boolean doesTweetExists(int id) {

		boolean ans = false;

		try {

			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id=" + id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			ans = rs.next();

		} catch (Exception e) {
			System.out.println("isTweetExists: " + e);
		}

		return ans;
	}

	public int follow(int follower_id, int followee_id) {

		if (!isUserRegistered(follower_id))
			return -1; //"The Follower doesn't exist!!!";
		else if (!isUserRegistered(followee_id))
			return -2; //"The Followee doesn't exist!!!";
		else if (isFollowerFolloweeMapped(follower_id, followee_id))
			return -3; //"The Follower is already following the Followe!!!";

		int result = incrementFollowers(followee_id, 1);
		this.incrementFollowees(follower_id, 1);
		this.relateUsers(follower_id, followee_id);

		try {

			String query = "INSERT INTO " + TwitterUtil.followerTable + " VALUES (?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, follower_id);
			st.setInt(2, followee_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return result;

	}

	public int unfollow(int follower_id, int unfollowee_id) {

		if (!isUserRegistered(follower_id))
			return -1; //"The Follower doesn't exist!!!";
		else if (!isUserRegistered(unfollowee_id))
			return -2; //"The Followee doesn't exist!!!";
		else if (!isFollowerFolloweeMapped(follower_id, unfollowee_id))
			return -3; //"The Follower is not following the Followe!!!";

		int result = incrementFollowers(unfollowee_id, -1);
		incrementFollowees(follower_id, -1);

		try {

			String query = "DELETE FROM " + TwitterUtil.followerTable + " WHERE follower_id=? AND followee_id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, follower_id);
			st.setInt(2, unfollowee_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return result;

	}

	private boolean isFollowerFolloweeMapped(int follower_id, int followee_id) {

		boolean ans = false;

		try {

			String query = "SELECT * FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + follower_id
					+ " AND followee_id=" + followee_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			ans = rs.next();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	// Returns total followers
	private int incrementFollowers(int followee_id, int value) {

		try {

			String query = "UPDATE " + TwitterUtil.userTable + " SET total_followers = total_followers + ? WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, value);
			st.setInt(2, followee_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return getTotalFollowers(followee_id);

	}

	private void incrementFollowees(int follower_id, int value) {

		try {

			String query = "UPDATE " + TwitterUtil.userTable + " SET total_followees = total_followees + ? WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, value);
			st.setInt(2, follower_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	private int getTotalFollowers(int user_id) {

		try {

			String query = "SELECT total_followers FROM " + TwitterUtil.userTable + " WHERE id=" + user_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			if (rs.next())
				return rs.getInt(1);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return -1;

	}

	public String likeTweet(int tweet_id, int user_id) {

		if (!doesTweetExists(tweet_id))
			return "The Tweet ID doesn't exist!!!";
		else if (!isUserRegistered(user_id))
			return "The User ID doesn't exist!!!";
		else if (isTweetAlreadyLiked(tweet_id, user_id))
			return "The tweet has already been liked by this user!!!";

		this.incrementTweetLike(tweet_id, 1);
		this.relateUsers(user_id, getUserIdOfTweet(tweet_id));

		try {

			String query = "INSERT INTO " + TwitterUtil.likesTable + " VALUES (?, ?)";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, tweet_id);
			st.setInt(2, user_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return "LIKED";

	}

	public String unlikeTweet(int tweet_id, int user_id) {

		if (!doesTweetExists(tweet_id))
			return "The Tweet ID doesn't exist";
		else if (!isUserRegistered(user_id))
			return "The User ID doesn't exist";
		else if (!isTweetAlreadyLiked(tweet_id, user_id))
			return "The tweet has already been unliked by this user!!!";

		incrementTweetLike(tweet_id, -1);

		try {

			String query = "DELETE FROM " + TwitterUtil.likesTable + " WHERE tweet_id=? AND user_id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, tweet_id);
			st.setInt(2, user_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return "UNLIKED";

	}

	private boolean isTweetAlreadyLiked(int tweet_id, int user_id) {

		boolean ans = false;

		try {

			String query = "SELECT * FROM " + TwitterUtil.likesTable + " WHERE tweet_id=" + tweet_id + " AND user_id="
					+ user_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			ans = rs.next();

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	private void incrementTweetLike(int tweet_id, int value) {

		try {

			String query = "UPDATE " + TwitterUtil.tweetTable + " SET total_likes = total_likes + ? WHERE id=?";

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, value);
			st.setInt(2, tweet_id);

			st.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}

	public List<Tweet> getRetweetsOf(int id) {

		List<Tweet> retweets = new ArrayList<Tweet>();

		try {

			String subquery = "SELECT retweet_id FROM " + TwitterUtil.retweetTable + " WHERE tweet_id=" + id,
					query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id IN (" + subquery + ")";

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				retweets.add(getTweetFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return retweets;
	}

	public List<Tweet> getRepliesOf(int id) {

		List<Tweet> replies = new ArrayList<Tweet>();

		try {

			String subquery = "SELECT reply_id FROM " + TwitterUtil.replyTable + " WHERE tweet_id=" + id,
					query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id IN (" + subquery + ")";

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				replies.add(getTweetFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return replies;
	}

	public List<Tweet> getFeedsFor(int user_id, String mode) {
		
		String sort = null;
		
		if (TwitterUtil.RECENT_FEEDS.equals(mode))
			sort = " ORDER BY id DESC";
		else if (TwitterUtil.POPULAR_FEEDS.equals(mode))
			sort = " ORDER BY total_likes DESC, total_retweets DESC, total_replies DESC";
		else if (TwitterUtil.OLD_FEEDS.equals(mode))
			sort = "";
		else
			return null;
		
		List<Tweet> feeds = new ArrayList<Tweet>();
		
		try {
			
			String subquery = "SELECT followee_id FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id;
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE user_id IN (" + subquery + ")" + sort;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				feeds.add(getTweetFromResultSet(rs));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return feeds;
	}

	public Tweet getTweetForId(int id) {
		
		try {
			
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id=" + id;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			if (rs.next())
				return getTweetFromResultSet(rs);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return null;
		
	}
	
	public int getUserIdOfTweet(int tweet_id) {

		try {

			String query = "SELECT user_id FROM " + TwitterUtil.tweetTable + " WHERE id=" + tweet_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next())
				return rs.getInt(1);

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return -1;
	}


	public CompleteTweet getCompleteTweetWithReplies(int tweet_id) {
		
		if (!doesTweetExists(tweet_id))
			return null;
		
		return new CompleteTweet(this.getTweetForId(tweet_id), this.getRepliesOf(tweet_id), this.getRetweetsOf(tweet_id));
		
	}

	public List<TwitterUser> getAllUsers() {
		
		List<TwitterUser> users = new ArrayList<TwitterUser>();
		
		try {
			
			String query = "SELECT * FROM " + TwitterUtil.userTable;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				users.add(getUserFromResultSet(rs));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return users;
	}
	
	private TwitterUser getUserFromResultSet(ResultSet rs) {
		
		TwitterUser twitterUser = null;

		try {
			twitterUser = new TwitterUser(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getInt(4), rs.getString(5), rs.getString(6),
					rs.getString(7), rs.getString(8), rs.getInt(9), rs.getInt(10), rs.getInt(11), rs.getTimestamp(12), rs.getString(13));
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return twitterUser;
	}

	
	public List<Tweet> getAllTweets() {
		
		List<Tweet> allTweets = new ArrayList<Tweet>();
		
		try {
			
			String query = "SELECT * FROM " + TwitterUtil.tweetTable;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				allTweets.add(getTweetFromResultSet(rs));
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return allTweets;
	}

	public boolean deleteTweetByAdmin(int tweet_id) {
		
		int count = 0;
		
		try {
			
			String query = "DELETE FROM " + TwitterUtil.tweetTable + " WHERE id=?";
			
			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, tweet_id);

			count = st.executeUpdate();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return count != 0;
	}

	public Tweet addTweetByAdmin(Tweet tweet) {

		return addTweet(tweet);
		
	}
	
	public List<String> getAllHashtags() {
		
		List<String> hashtags = new ArrayList<String>();
		
//		try {
//			
//			String query = "SELECT DISTINCT hashtag FROM " + TwitterUtil.hashtagsOldTable;
//			
//			Statement st = con.createStatement();
//			ResultSet rs = st.executeQuery(query);
//			
//			while (rs.next())
//				hashtags.add(rs.getString(1));
//			
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
		
		try {
		
			String query = "SELECT hashtag FROM " + TwitterUtil.hashtagsTable;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				hashtags.add(rs.getString(1));
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return hashtags;
	}
		
	public List<Tweet> getTweetsOfHashtag(String hashtag) {
		
		List<Tweet> tweets = new ArrayList<Tweet>();
		
//		try {
//			
//			String subquery = "SELECT tweet_id FROM " + TwitterUtil.hashtagsOldTable + " WHERE hashtag='" + hashtag + "'";
//			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id IN (" + subquery + ")";
//			
//			Statement st = con.createStatement();
//			ResultSet rs = st.executeQuery(query);
//			
//			while (rs.next())
//				tweets.add(getTweetFromResultSet(rs));
//			
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
		
		int hashtagId = getHashtagId(hashtag);
		
		try {
			
			String subquery = "SELECT tweet_id FROM " + TwitterUtil.hash_tweet_table + " WHERE hashtag_id=" + hashtagId;
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id IN (" + subquery + ")";
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				tweets.add(getTweetFromResultSet(rs));
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return tweets;
		
	}

	public int getHashtagTweetCount(int hashtag_id) {

		try {

			String query = "SELECT COUNT(*) FROM " + TwitterUtil.hash_tweet_table + " WHERE hashtag_id=" + hashtag_id;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			rs.next();
			return rs.getInt(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return -1;

	}
	
	public Map<String, Integer> getRecommendedHashtags(String wildcard, int pageStart, int pageSize) {
		
		Map<String, Integer> ans = new LinkedHashMap<String, Integer>();

		wildcard = EncodingUtil.decodeURIComponent(wildcard);

		try {
			
			String query = 
					
					"SELECT hashtag, id FROM " + TwitterUtil.hashtagsTable + " WHERE hashtag LIKE CONCAT('%', '" + wildcard + "', '%') ORDER BY LOCATE('" + wildcard + "', hashtag), hashtag LIMIT " + pageStart + ", " + pageSize;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				ans.put(rs.getString(1), getHashtagTweetCount(rs.getInt(2)));
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return ans;		
		
	}

	public List<Mention> getRecommendedMentions(String wildcard, int user_id, int pageStart, int pageSize) {
		
		List<Mention> ans = new ArrayList<>();
		
		try {			
			
			String query = 
					"SELECT id, user_name, mention_name FROM " + TwitterUtil.userTable + " WHERE mention_name LIKE CONCAT('%', '" + wildcard + "', '%') OR user_name LIKE CONCAT('%', '" + wildcard + "', '%') ORDER BY"
						 + " LOCATE('" + wildcard + "', mention_name), LOCATE('" + wildcard + "', user_name),"
						 + " (SELECT COUNT(*) FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id + " AND followee_id=id) DESC,"
						 + " (SELECT COUNT(*) FROM " + TwitterUtil.user_rel_table + " WHERE from_user=" + user_id + " AND to_user=id) DESC,"
						 + " total_followers DESC, total_tweets DESC"
						 + " LIMIT " + pageStart + ", " + pageSize;

			System.out.println(query);

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next()) {

				int followee_id = rs.getInt(1);
				String followerQuery = "SELECT * FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id + " AND followee_id=" + followee_id;

				ans.add(new Mention(followee_id, rs.getString(2), rs.getString(3), con.createStatement().executeQuery(followerQuery).next()));

			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return ans;

	}

	public List<Tweet> getTweetsBasedOnSearch(String wildcard) {
		
		List<Tweet> ans = new ArrayList<Tweet>();
		
		try {
			
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE LOCATE('" + wildcard + "', quote) != 0";
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			while (rs.next())
				ans.add(this.getTweetFromResultSet(rs));
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return ans;
	}

	public int getUserIdByNameAndPassword(String username, String password) {
		
		try {
			
			String query = "SELECT id FROM " + TwitterUtil.userTable + " WHERE user_name='" + username + "' AND password='" + password + "'";
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			if (rs.next())
				return rs.getInt(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return -1;

	}

	public void updateHashtagWeight(String hashtag, double weight) {

		try {

			String query = "UPDATE " + TwitterUtil.hashtagsTable + " SET weight=" + weight + " WHERE hashtag='" + hashtag.substring(1) + "'";
			
			PreparedStatement p = con.prepareStatement(query);
            
			p.execute();
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public List<String> getUserInfoForUserId(int userId) {

		List<String> userDetails = new ArrayList<>();

		try {

			String query = "SELECT user_name, mention_name FROM " + TwitterUtil.userTable + " WHERE id=" + userId;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			if (rs.next()) {
				userDetails.add(rs.getString(1));
				userDetails.add(rs.getString(2));
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return userDetails;
	}

	public List<SingleTweet> getFeeds(int user_id, String mode) {
		
		List<SingleTweet> feeds = new ArrayList<>();

		for (Tweet tweet: getFeedsFor(user_id, mode)) {

			List<String> userInfo = getUserInfoForUserId(tweet.getUser_id());

			feeds.add(new SingleTweet(userInfo.get(0), userInfo.get(0), tweet));
			
		}

		return feeds;
	}

	public void setProfileImage(int id, Blob profile_img) {
		
		try {

			String query = "INSERT INTO " + TwitterUtil.hashtagsTable + "(id, profile_img) VALUES(?, ?) ON DUPLICATE KEY UPDATE profile_img=?";

			System.out.println(query);

			PreparedStatement st = con.prepareStatement(query);

			st.setInt(1, id);
			st.setBlob(2, profile_img);
			st.setBlob(3, profile_img);

			st.executeUpdate();
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}


	public TweetBox getParentIfRetweet(int retweet_id) {

		TweetBox ans = null;

		try {
			
			String subquery = "SELECT tweet_id FROM " + TwitterUtil.retweetTable + " WHERE retweet_id="+ retweet_id;
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id = (" + subquery + ")";
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			if (rs.next()) {

				Tweet tweet = this.getTweetFromResultSet(rs);
				TwitterUser tweetUser = this.getUser(tweet.getUser_id());
				
				ans = new TweetBox(tweetUser, tweet);
				
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;
	}

	public TweetBox getParentIfReply(int reply_id) {

		TweetBox ans = null;

		try {
			
			String subquery = "SELECT tweet_id FROM " + TwitterUtil.replyTable + " WHERE reply_id="+ reply_id;
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE id = (" + subquery + ")";
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
			
			if (rs.next()) {

				Tweet tweet = this.getTweetFromResultSet(rs);
				TwitterUser tweetUser = this.getUser(tweet.getUser_id());
				
				ans = new TweetBox(tweetUser, tweet);
				
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;
	}

	public List<TweetPiece> getRealFeeds(int user_id, Timestamp minTimestamp, int pageStart, int pageSize) {

		List<TweetPiece> ans = new ArrayList<>();
		
		try {
			
			String subquery = "(SELECT user_id IN (SELECT followee_id FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id + "))";
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE created_at <= '" + minTimestamp + "' ORDER BY " + subquery + " DESC, created_at DESC LIMIT " + pageStart + ", " + pageSize;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			TweetBox parentBox;
			
			while (rs.next()) {

				parentBox = null;

				Tweet childTweet = this.getTweetFromResultSet(rs);
				TweetBox childBox = new TweetBox(this.getUser(childTweet.getUser_id()), childTweet);

				if (null != (parentBox = getParentIfRetweet(childTweet.getId())))
					ans.add(new TweetPiece(childTweet.getQuote() != null ? "QUOTED" : "RETWEET", parentBox, childBox));
				else if (null != (parentBox = getParentIfReply(childTweet.getId())))
					ans.add(new TweetPiece("REPLY", parentBox, childBox));
				else
					ans.add(new TweetPiece("NONE", null, childBox));

			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;
	}

	public int wasRetweetedByUser(int user_id, int tweet_id) {

		int ans = 0;

		try {

			String subquery = "SELECT retweet_id FROM " + TwitterUtil.retweetTable + " WHERE tweet_id=" + tweet_id;
			String query = "SELECT COUNT(*) FROM " + TwitterUtil.tweetTable + " WHERE id IN (" + subquery + ") AND user_id=" + user_id + " AND quote IS NULL;";

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			// CHECK RETWEET COUNT = 1
			ans = rs.next() ? rs.getInt(1) == 1 ? 1 : 0 : 0;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return ans;

	}

	public int wasTweetLikedByUser(int user_id, int tweet_id) {

		int ans = 0;

		try {

			String query = "SELECT * FROM " + TwitterUtil.likesTable + " WHERE user_id=" + user_id + " AND tweet_id=" + tweet_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			ans = rs.next() ? 1 : 0;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return ans;

	}

    public int getInitQQ(int user_id, int tweet_id) {
        
		return wasRetweetedByUser(user_id, tweet_id) * 2 + wasTweetLikedByUser(user_id, tweet_id);

    }

	public List<TweetPiece> getAllTweetsOfProfile(int user_id, Timestamp minTimestamp, int pageStart, int pageSize) {

		List<TweetPiece> ans = new ArrayList<>();
		
		try {

			String subquery = "(SELECT tweet_id FROM likes_table WHERE user_id=" + user_id + ")";
			String query = "SELECT * FROM tweet_table WHERE user_id=" + user_id + " OR id IN " + subquery + " ORDER BY created_at DESC LIMIT " + pageStart + ", " + pageSize;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			TweetBox parentBox;
			
			while (rs.next()) {

				parentBox = null;

				Tweet childTweet = this.getTweetFromResultSet(rs);
				TweetBox childBox = new TweetBox(this.getUser(childTweet.getUser_id()), childTweet);

				if (null != (parentBox = getParentIfRetweet(childTweet.getId())))
					ans.add(new TweetPiece(childTweet.getQuote() != null ? "QUOTED" : "RETWEET", parentBox, childBox));
				else if (null != (parentBox = getParentIfReply(childTweet.getId())))
					ans.add(new TweetPiece("REPLY", parentBox, childBox));
				else
					ans.add(new TweetPiece("NONE", null, childBox));

			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public List<TweetPiece> getRetweetsOfProfile(int user_id, Timestamp minTimestamp, int pageStart, int pageSize) {

		List<TweetPiece> ans = new ArrayList<>();
		
		try {

			String subquery = "(SELECT retweet_id FROM " + TwitterUtil.retweetTable + ")";
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE user_id=" + user_id + " AND id IN " + subquery + "ORDER BY created_at DESC LIMIT " + pageStart + ", " + pageSize;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			TweetBox parentBox;
			
			while (rs.next()) {

				parentBox = null;

				Tweet childTweet = this.getTweetFromResultSet(rs);
				TweetBox childBox = new TweetBox(this.getUser(childTweet.getUser_id()), childTweet);

				parentBox = getParentIfRetweet(childTweet.getId());
				ans.add(new TweetPiece(childTweet.getQuote() != null ? "QUOTED" : "RETWEET", parentBox, childBox));
				// else if (null != (parentBox = getParentIfReply(childTweet.getId())))
					// ans.add(new TweetPiece("REPLY", parentBox, childBox));
				// else
				// 	ans.add(new TweetPiece("NONE", null, childBox));

			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public List<TweetPiece> getRepliesOfProfile(int user_id, Timestamp minTimestamp, int pageStart, int pageSize) {

		List<TweetPiece> ans = new ArrayList<>();
		
		try {

			String subquery = "(SELECT reply_id FROM " + TwitterUtil.replyTable + ")";
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE user_id=" + user_id + " AND id IN " + subquery + "ORDER BY created_at DESC LIMIT " + pageStart + ", " + pageSize;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			TweetBox parentBox;
			
			while (rs.next()) {

				parentBox = null;

				Tweet childTweet = this.getTweetFromResultSet(rs);
				TweetBox childBox = new TweetBox(this.getUser(childTweet.getUser_id()), childTweet);

				// if (null != (parentBox = getParentIfRetweet(childTweet.getId())))
				// 	ans.add(new TweetPiece(childTweet.getQuote() != null ? "QUOTED" : "RETWEET", parentBox, childBox));
				parentBox = getParentIfReply(childTweet.getId());
				ans.add(new TweetPiece("REPLY", parentBox, childBox));
				// else
				// 	ans.add(new TweetPiece("NONE", null, childBox));

			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public List<TweetPiece> getLikesOfProfile(int user_id, Timestamp minTimestamp, int pageStart, int pageSize) {

		List<TweetPiece> ans = new ArrayList<>();
		
		try {

			String subquery = "(SELECT tweet_id FROM " + TwitterUtil.likesTable + " WHERE user_id=" + user_id + ")";
			String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE created_at <= '" + minTimestamp + "' AND id IN " + subquery + " ORDER BY created_at DESC LIMIT " + pageStart + ", " + pageSize;
			
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			TweetBox parentBox;
			
			while (rs.next()) {

				parentBox = null;

				Tweet childTweet = this.getTweetFromResultSet(rs);
				TweetBox childBox = new TweetBox(this.getUser(childTweet.getUser_id()), childTweet);

				if (null != (parentBox = getParentIfRetweet(childTweet.getId())))
					ans.add(new TweetPiece(childTweet.getQuote() != null ? "QUOTED" : "RETWEET", parentBox, childBox));
				else if (null != (parentBox = getParentIfReply(childTweet.getId())))
					ans.add(new TweetPiece("REPLY", parentBox, childBox));
				else
					ans.add(new TweetPiece("NONE", null, childBox));

			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public boolean isFollowing(String user_id, String followee_id) {
		
		try {

			String query = "SELECT * FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id + " AND followee_id=" + followee_id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			return rs.next();

		} catch (SQLException e) {
			e.printStackTrace();
		}
	
		return false;

	}

	public String getMentionNameFromId(int id) {
		
		try {

			String query = "SELECT mention_name FROM " + TwitterUtil.userTable + " WHERE id=" + id;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			rs.next();

			return rs.getString(1);

		} catch (SQLException e) {
			e.printStackTrace();
		}
	
		return null;
	}

/*

SELECT * FROM tweet_table WHERE

    total_likes >= 0 AND total_replies >= 0 AND total_retweets >= 0
    
    AND
    created_at >= '2022-05-12' AND created_at <= '2022-05-20'
    
    AND
    user_id IN (SELECT followee_id FROM follower_table WHERE follower_id=1)

    AND
    (
        id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN 
            (SELECT id FROM hashtags_table WHERE hashtag REGEXP 'dorsey|java') 
            UNION
            (SELECT tweet_id FROM mention_tweet_table WHERE user_id IN 
                (SELECT id FROM user_table WHERE mention_name REGEXP 'navinsk7936|beiber2727')
            )
        ) 
        OR
        user_id IN (SELECT id FROM user_table WHERE mention_name REGEXP 'navinsk7936|beiber2727')
    )

    ORDER BY total_likes DESC, total_replies DESC, total_retweets DESC

;

*/

	public List<TweetPiece> getExploreQQQ(
		int user_id,
		String search,
		int total_likes, int total_replies, int total_retweets,
		String fromDate, String toDate,
		int start, int size,
		String order, // TOP, RECENT
		String cfrom, // ANYONE || ONLY-FOLLOWERS
		String creply // ALL || ONLY-REPLIES
	) {

		List<TweetPiece> ans = new ArrayList<>();

		if (search == null || search.isEmpty())
			return ans;

		String orderBy = order.equals("TOP") ? "ORDER BY total_likes DESC, total_replies DESC, total_retweets DESC" :
				order.equals("RECENT") ? "ORDER BY created_at DESC" : "";

		String cFromFilter = cfrom.equals("ANYONE") ? "" :
			cfrom.equals("ONLY-FOLLOWERS") ? "AND user_id IN (SELECT followee_id FROM follower_table WHERE follower_id=" + user_id + ")" : "";
		
		String cReplyFilter = creply.equals("ALL") ? "" :
			creply.equals("ONLY-REPLIES") ? "AND id IN (SELECT reply_id FROM reply_table)" : "";

		String finalHashtags = "", finalMentions = "";
		for (String word: search.split(" ")) {

			if (word.isEmpty())
				continue;
			else if (word.charAt(0) == '#') {
				finalHashtags += (finalHashtags.isEmpty() ? "" : "|") + word.substring(1);
			} else if (word.charAt(0) == '@') {
				finalMentions += (finalMentions.isEmpty() ? "" : "|") + word.substring(1);
			}

		}
		finalHashtags = finalHashtags.isEmpty() ? " " : finalHashtags;
		finalMentions = finalMentions.isEmpty() ? " " : finalMentions;

		String limitBy = ~start == 0 || ~size == 0 ? "" : "LIMIT " + start + ", " + size;

		String query = 
	
	"SELECT * FROM tweet_table WHERE " +

		"total_likes >= " + total_likes + " AND total_replies >= " + total_replies + " AND total_retweets >= " + total_retweets + " " +
		
		"AND " +
		"created_at >= '" + fromDate + "' AND created_at <= '" + toDate + "' " +
		
		cFromFilter + " " +

		cReplyFilter + " " +

		"AND " +
		"(" +
			"id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN " +
				"(SELECT id FROM hashtags_table WHERE hashtag REGEXP '" + finalHashtags + "') " +
				"UNION " +
				"(SELECT tweet_id FROM mention_tweet_table WHERE user_id IN " +
					"(SELECT id FROM user_table WHERE mention_name REGEXP '" + finalMentions + "')" +
				")" +
			") " +
			"OR " +
			"user_id IN (SELECT id FROM user_table WHERE mention_name REGEXP '" + finalMentions + "')" +
		") " +

		orderBy + " " +

		limitBy

	;

		System.out.println(query);

		try {

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			TweetBox parentBox;
		
			while (rs.next()) {

				parentBox = null;

				Tweet childTweet = this.getTweetFromResultSet(rs);
				TweetBox childBox = new TweetBox(this.getUser(childTweet.getUser_id()), childTweet);

				if (null != (parentBox = getParentIfRetweet(childTweet.getId())))
					ans.add(new TweetPiece(childTweet.getQuote() != null ? "QUOTED" : "RETWEET", parentBox, childBox));
				else if (null != (parentBox = getParentIfReply(childTweet.getId())))
					ans.add(new TweetPiece("REPLY", parentBox, childBox));
				else
					ans.add(new TweetPiece("NONE", null, childBox));

			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;
		
	}

/*

	SELECT followee_id FROM follower_table WHERE follower_id=1 AND followee_id IN (



	SELECT id FROM user_table WHERE mention_name REGEXP @finalMentions

	UNION


	SELECT user_id FROM status_mention_table WHERE mention_id IN (SELECT id FROM user_table WHERE mention_name REGEXP @finalMentions)

	UNION

	SELECT user_id FROM tweet_table WHERE id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP @finalHashtags))
	

	UNION


	SELECT user_id FROM status_hash_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP @finalHashtags)

	UNION

	SELECT user_id FROM tweet_table WHERE id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP @finalHashtags))

	)

*/

	public List<TwitterUser> getExploreQQQPeople(
		int user_id,
		String search,
		int total_likes, int total_replies, int total_retweets,
		String fromDate, String toDate,
		int start, int size,
		String cfrom, // ANYONE || ONLY-FOLLOWERS
		String creply // ALL || ONLY-REPLIES
	) {

		List<TwitterUser> ans = new ArrayList<>();

		if (search == null || search.isEmpty())
			return ans;

		String cFromFilter = cfrom.equals("ANYONE") ? "" :
			cfrom.equals("ONLY-FOLLOWERS") ? "AND user_id IN (SELECT followee_id FROM follower_table WHERE follower_id=" + user_id + ")" : "";
		
		String cReplyFilter = creply.equals("ALL") ? "" :
			creply.equals("ONLY-REPLIES") ? "AND id IN (SELECT reply_id FROM reply_table)" : "";


		
		String finalHashtags = "", finalMentions = "";
		for (String word: search.split(" "))
			if (word.isEmpty())
				continue;
			else if (word.charAt(0) == '#') {
				finalHashtags += (finalHashtags.isEmpty() ? "" : "|") + word.substring(1);
			} else if (word.charAt(0) == '@') {
				finalMentions += (finalMentions.isEmpty() ? "" : "|") + word.substring(1);
			}
		finalHashtags = finalHashtags.isEmpty() ? " " : finalHashtags;
		finalMentions = finalMentions.isEmpty() ? " " : finalMentions;



		String limitBy = ~start == 0 || ~size == 0 ? "" : "LIMIT " + start + ", " + size;




		String tweetFilter = 

			"AND " +
			"total_likes >= " + total_likes + " AND total_replies >= " + total_replies + " AND total_retweets >= " + total_retweets + " " +

			"AND " +
			"created_at >= '" + fromDate + "' AND created_at <= '" + toDate + "' " +

			cFromFilter + " " +

			cReplyFilter;




		String query = 

			"SELECT * FROM user_table WHERE id IN (" +
		
				"SELECT id FROM user_table WHERE mention_name REGEXP '" + finalMentions + "' " +

				"UNION " +


				"SELECT user_id FROM status_mention_table WHERE mention_id IN (SELECT id FROM user_table WHERE mention_name REGEXP '" + finalMentions + "') " +

				"UNION " +

				"SELECT user_id FROM tweet_table WHERE id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP '" + finalHashtags + "')) " + tweetFilter + " " +


				"UNION " +


				"SELECT user_id FROM status_hash_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP '" + finalHashtags + "') " +

				"UNION " +

				"SELECT user_id FROM tweet_table WHERE id IN (SELECT tweet_id FROM hash_tweet_table WHERE hashtag_id IN (SELECT id FROM hashtags_table WHERE hashtag REGEXP '" + finalHashtags + "')) " + tweetFilter + " " +

			")" +

			limitBy;

		System.out.println(query);

		try {

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);
		
			while (rs.next())
				ans.add(getUserFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public Map<String, Integer> getTrendingHashtags(int limit) {

		Map<String, Integer> ans = new LinkedHashMap<String, Integer>();

		try {

			String query = "SELECT hashtag, wcount FROM " + TwitterUtil.hashtagsTable + " ORDER BY wcount DESC, wlike DESC, wreply DESC, wretweet DESC LIMIT " + limit;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				ans.put(rs.getString(1), rs.getInt(2));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public Map<Integer, Integer> getTrendingMentions(int limit) {

		Map<Integer, Integer> ans = new LinkedHashMap<Integer, Integer>();

		try {

			String query = "SELECT user_id, wcount FROM " + TwitterUtil.mention_trend_table + " ORDER BY wcount DESC, wlike DESC, wreply DESC, wretweet DESC LIMIT " + limit;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				ans.put(rs.getInt(1), rs.getInt(2));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public int getTotalUsers() {

		try {

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM " + TwitterUtil.userTable);

			if (rs.next())
				return rs.getInt(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return -1;
	}


	public List<TwitterUser> getFolloweesForProfileFollowerOf(int user_id, int follower_id, int pageStart, int pageSize) {

		List<TwitterUser> ans = new ArrayList<>();

		try {

			String query = "SELECT * FROM " + TwitterUtil.userTable + " WHERE id IN (SELECT followee_id FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + follower_id + ") " +
							"ORDER BY id IN (SELECT followee_id FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id + ") DESC LIMIT " + pageStart + ", " + pageSize;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				ans.add(getUserFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public List<TwitterUser> getFollowersForProfileFollowerOf(int user_id, int followee_id, int pageStart, int pageSize) {

		List<TwitterUser> ans = new ArrayList<>();

		try {

			String query = "SELECT * FROM " + TwitterUtil.userTable + " WHERE id IN (SELECT follower_id FROM " + TwitterUtil.followerTable + " WHERE followee_id=" + followee_id + ") " +
							"ORDER BY id IN (SELECT followee_id FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + user_id + ") DESC LIMIT " + pageStart + ", " + pageSize;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				ans.add(getUserFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}

	public List<TwitterUser> getFollowersYouKnowFor(int user_id, int that_user_id, int pageStart, int pageSize) {

		List<TwitterUser> ans = new ArrayList<>();

		if (user_id == that_user_id)
			return ans;

		try {

			String subquery = "SELECT followee_id FROM " + TwitterUtil.followerTable + " WHERE follower_id=" + that_user_id + " AND followee_id IN " +
								"(SELECT to_user FROM " + TwitterUtil.user_rel_table + " WHERE from_user=" + user_id + ")";
			String query = "SELECT * FROM " + TwitterUtil.userTable + " WHERE id IN (" + subquery + ") ORDER BY total_followers DESC LIMIT " + pageStart + ", " + pageSize;

			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery(query);

			while (rs.next())
				ans.add(getUserFromResultSet(rs));

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return ans;

	}


	public List<Tweet> getParentTweets(int tweet_id) {

		List<Tweet> ans = new ArrayList<>();

		

		return ans;
	}
	

}
