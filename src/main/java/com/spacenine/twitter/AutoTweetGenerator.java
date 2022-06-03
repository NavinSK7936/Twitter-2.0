package com.spacenine.twitter;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.arpit.java2blog.bean.Tweet;
import org.arpit.java2blog.service.TwitterService;
import org.joda.time.DateTime;

public class AutoTweetGenerator {
    
    private final TwitterService service;

    private static volatile boolean isStarted = false;

    public AutoTweetGenerator(TwitterService service) {

        this.service = service;

    }


    void resetWeights() {

        String[] tableNames = {TwitterUtil.hashtagsTable, TwitterUtil.mention_trend_table};
        String[] weightNames = {"wreply", "wretweet", "wlike", "wcount"};

        for (String tableName: tableNames)
            for (String weightName: weightNames)
                try {
                    String query = "UPDATE " + tableName + " SET " + weightName + "=DEFAULT";
                    PreparedStatement st = service.con.prepareStatement(query);
                    st.executeUpdate();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
        
    }

    public void start() {

        if (isStarted)
            return;

        isStarted = true;

        new Thread(new Runnable() {
			@Override
			public void run() {

                while (true) {

                    resetWeights();

                    new DateTime();
                    Timestamp minimumTimestamp = new Timestamp(DateTime.now().minusMonths(2).toDate().getTime() / 1000l);

                    String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE created_at >= '" + minimumTimestamp + "'";

                    for (Tweet tweet: service.getTweetsForCustomQuery(query)) {

                        for (String hashtag: tweet.getHashtags())
                            try {
                                String updateHashtagQuery = "UPDATE " + TwitterUtil.hashtagsTable + " SET wreply=wreply+" + tweet.getTotal_replies() + ", wretweet=wretweet+" + tweet.getTotal_retweets() + ", wlike=wlike+" + tweet.getTotal_likes() + ", wcount=wcount+1 WHERE hashtag='" + hashtag.substring(1) + "'";
                                PreparedStatement st = service.con.prepareStatement(updateHashtagQuery);
                                st.executeUpdate();
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }

                        for (Integer mentionId: tweet.getMentions())
                            try {
                                String updateMentionQuery = "UPDATE " + TwitterUtil.mention_trend_table + " SET wreply=wreply+" + tweet.getTotal_replies() + ", wretweet=wretweet+" + tweet.getTotal_retweets() + ", wlike=wlike+" + tweet.getTotal_likes() + ", wcount=wcount+1 WHERE user_id=" + mentionId;
                                PreparedStatement st = service.con.prepareStatement(updateMentionQuery);
                                st.executeUpdate();
                            } catch (SQLException e) {
                                e.printStackTrace();
                            }
                        
                    }
            
                    try { Thread.sleep(5000); }
                    catch (InterruptedException e) { e.printStackTrace(); }

                }
            }
        }).start();

    }




    int getRandomUserId() {

        int total_users = service.getTotalUsers();
        int n = new Random().nextInt(total_users) + 1;

        try {
			
			Statement st = service.con.createStatement();
			ResultSet rs = st.executeQuery("SELECT id FROM " + TwitterUtil.userTable + " ORDER BY ID LIMIT " + (n - 1) + ", 1;");

			if (rs.next())
				return rs.getInt(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

        return -1;

    }

    List<String> getRandomHashtags(int limit) {

        List<String> ans = new ArrayList<>();

        try {
			
			Statement st = service.con.createStatement();
			ResultSet rs = st.executeQuery("SELECT hashtag FROM " + TwitterUtil.hashtagsTable + " ORDER BY RAND() LIMIT " + limit);

			while (rs.next())
				ans.add("#" + rs.getString(1));
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

        return ans;

    }

    List<String> getRandomMentions(int limit) {

        List<String> ans = new ArrayList<>();

        try {
			
			Statement st = service.con.createStatement();
			ResultSet rs = st.executeQuery("SELECT id FROM " + TwitterUtil.userTable + " ORDER BY RAND() LIMIT " + limit);

			while (rs.next())
				ans.add("${{" + rs.getInt(1) + "}}");
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

        return ans;
        
    }

    public void autoGenerate() {

        List<Tweet> currTweets = new ArrayList<>(), nextTweets = new ArrayList<>();

        int minHashtags = 5, minMentions = 5;


        String hashtagsString = getRandomHashtags(minHashtags).stream().collect(Collectors.joining(" "));
        String mentionsString = getRandomMentions(minMentions).stream().collect(Collectors.joining(" "));

        Tweet tweet = new Tweet();
        tweet.setUser_id(getRandomUserId());
        tweet.setQuote("Just auto generated to mention " + mentionsString + " and trend " + hashtagsString);


        System.out.println("AUTO GENERATED!!!!!!");
        System.out.println(tweet.getUser_id());
        System.out.println(tweet.getQuote());
        System.out.println(tweet.getHashtags());
        System.out.println(tweet.getMentions());
       

    }

}
