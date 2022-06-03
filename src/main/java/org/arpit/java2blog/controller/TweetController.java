package org.arpit.java2blog.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;

import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import com.spacenine.twitter.EncodingUtil;
import com.spacenine.twitter.TwitterUtil;

import org.arpit.java2blog.bean.CompleteTweet;
import org.arpit.java2blog.bean.SingleTweet;
import org.arpit.java2blog.bean.Tweet;
import org.arpit.java2blog.bean.TweetPiece;
import org.arpit.java2blog.bean.TwitterUser;
import org.arpit.java2blog.bean.Value;
import org.arpit.java2blog.service.TwitterService;
import org.codehaus.jackson.annotate.JsonProperty;

@Path("tweet")
public class TweetController {

	private final TwitterService service = new TwitterService();

	public TweetController() {
		System.out.println("OKKKKKKKKKKKK");
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Tweet addTweet(Tweet tweet) {
		
		return service.addTweet(tweet);
		
	}

	@GET
	@Path("id/{tweet_id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Tweet getTweetById(@PathParam("tweet_id") int tweet_id) {
		
		return service.getTweetForId(tweet_id);
		
	}
	
	@GET
	@Path("{user_id}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Tweet> getTweetsOfUserId(@PathParam("user_id") int user_id) {

		return service.getTweetsOfUserId(user_id);
		
	}
	
	// @DELETE
	// @Produces(MediaType.APPLICATION_JSON)
	// public boolean deleteTweet(@PathParam("id") int tweet_id) {
		
	// 	return service.deleteTweet(tweet_id);
		
	// }
	
	@GET
	@Path("like")
	@Produces(MediaType.TEXT_PLAIN)
	public String likeTweet(@QueryParam("tweet_id") int tweet_id, @QueryParam("user_id") int user_id) {
		
		return service.likeTweet(tweet_id, user_id);
		
	}
	
	@GET
	@Path("unlike")
	@Produces(MediaType.TEXT_PLAIN)
	public String unlikeTweet(@QueryParam("tweet_id") int tweet_id, @QueryParam("user_id") int user_id) {
		
		return service.unlikeTweet(tweet_id, user_id);
		
	}

	@POST
	@Path("likes")
	@Produces(MediaType.APPLICATION_JSON)
	public String alterLikes(@QueryParam("tweet_id") int tweet_id, @QueryParam("user_id") int user_id, Value value) {

		int op = value.getValue();
		
		return op == 1 ? service.likeTweet(tweet_id, user_id) : op == -1 ? service.unlikeTweet(tweet_id, user_id) : "INVALID LOAD";
		
	}
	
	
	@POST
	@Path("retweet")
	@Produces(MediaType.APPLICATION_JSON)
	public Tweet addRetweet(@QueryParam("parent_tweet_id") int id,  Tweet retweet) {
		
		System.out.println(id + ": " + retweet);
		
		return service.addRetweet(id, retweet);
		
	}

	@DELETE
	@Path("undo/retweet")
	@Produces(MediaType.APPLICATION_JSON)
	public Tweet undoRetweet(@QueryParam("parent_tweet_id") int parent_tweet_id, @QueryParam("user_id") int user_id) {
		
		return service.undoRetweet(parent_tweet_id, user_id);
		
	}
	
	@POST
	@Path("reply")
	@Produces(MediaType.APPLICATION_JSON)
	public Tweet addReplyTweet(@QueryParam("parent_tweet_id") int id,  Tweet replyTweet) {
		
		System.out.println(id + ": " + replyTweet);
		
		return service.addReplyTweet(id, replyTweet);
		
	}
	
	@GET
	@Path("quotes/{retweets_of}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Tweet> getRetweetsOf(@PathParam("retweets_of") int id) {
		
		return service.getRetweetsOf(id);
		
	}
	
	@GET
	@Path("replies/{replies_of}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Tweet> getRepliesOf(@PathParam("replies_of") int id) {
		
		return service.getRepliesOf(id);
		
	}
	
	// @GET
	// @Path("feeds")
	// @Produces(MediaType.APPLICATION_JSON)
	// public List<Tweet> getFeedsFor(@QueryParam("user_id") int user_id, @DefaultValue(TwitterUtil.RECENT_FEEDS) @QueryParam("mode") String mode) {
		
	// 	return service.getFeedsFor(user_id, mode);
		
	// }
	
	@GET
	@Path("complete")
	@Produces(MediaType.APPLICATION_JSON)
	public CompleteTweet getCompleteTweetWithReplies(@QueryParam("tweet_id") int tweet_id) {
		
		return service.getCompleteTweetWithReplies(tweet_id);
		
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Tweet> getTweetsOfHashtag(@QueryParam("hashtag") String hashtag) {
		
		return service.getTweetsOfHashtag(hashtag);
		
	}
	
	@GET
	@Path("hashtags")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Integer> getRecommendedHashtags(
		@QueryParam("wildcard") String wildcard,
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize) {

		return service.getRecommendedHashtags(wildcard, pageStart, pageSize);
		
	}

	@GET
	@Path("hashtags/trending")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Integer> getTrendingHashtags(@QueryParam("limit") int limit) {

		return service.getTrendingHashtags(limit);
		
	}

	@GET
	@Path("mentions/trending")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<Integer, Integer> getTrendingMentions(@QueryParam("limit") int limit) {

		return service.getTrendingMentions(limit);
		
	}
	
	@GET
	@Path("search")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Tweet> getTweetsBasedOnSearch(@QueryParam("wildcard") String wildcard) {
		
		return service.getTweetsBasedOnSearch(wildcard);
		
	}
	
	@POST
	@Path("dummy")
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_FORM_URLENCODED})
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String dummy(@FormParam("name") String name,
			@FormParam("password") String password) {
		
		System.out.println(name + ":" + password);
		
		return name + ":" + password;
		
	}

	@GET
	@Path("feeds")
	@Produces(MediaType.APPLICATION_JSON)
	public List<SingleTweet> getFeedsAsSingleTweet(@QueryParam("user_id") int user_id, @DefaultValue(TwitterUtil.RECENT_FEEDS) @QueryParam("mode") String mode) {
		
		return service.getFeeds(user_id, mode);

	}

	@GET
	@Path("rfeeds")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TweetPiece> getFeedsAsSingleTweet(@QueryParam("user_id") int user_id,
		@QueryParam("minTs") Timestamp minTimestamp,
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize) {

		return service.getRealFeeds(user_id, minTimestamp, pageStart, pageSize);

	}

	@GET
	@Path("iqqt")
	@Produces(MediaType.APPLICATION_JSON)
	public int getInitQQ(@QueryParam("user_id") int user_id, @QueryParam("tweet_id") int tweet_id) {

		return service.getInitQQ(user_id, tweet_id);

	}

	@GET
	@Path("tprofile")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TweetPiece> getProfileQQQQ(@QueryParam("user_id") int user_id,
		@QueryParam("minTs") Timestamp minTimestamp,
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize,
		@QueryParam("index") int index) {
		
		return index == 0 ? service.getAllTweetsOfProfile(user_id, minTimestamp, pageStart, pageSize) :
				index == 1 ? service.getRetweetsOfProfile(user_id, minTimestamp, pageStart, pageSize) :
				index == 2 ? service.getRepliesOfProfile(user_id, minTimestamp, pageStart, pageSize) :
				index == 3 ? service.getLikesOfProfile(user_id, minTimestamp, pageStart, pageSize) :
				null;

	}

	@GET
	@Path("texplore")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TweetPiece> getExploreQQQ(@QueryParam("user_id") int user_id,
		@QueryParam("q") String search,
		@QueryParam("cfrom") String cfrom, // ANYONE || ONLY-FOLLOWERS
		@QueryParam("creply") String creply, // ALL || ONLY-REPLIES
		@DefaultValue("0") @QueryParam("likes") int total_likes, @DefaultValue("0") @QueryParam("replies") int total_replies, @DefaultValue("0") @QueryParam("retweets") int total_retweets,
		@QueryParam("minTs") Timestamp minTimestamp, @QueryParam("from") String from, @QueryParam("to") String to,
		@QueryParam("start") int pageStart, @QueryParam("size") int pageSize,
		@QueryParam("order") String order // TOP, RECENT
		) {

		return service.getExploreQQQ(user_id, search, total_likes, total_replies, total_retweets, from, to, pageStart, pageSize, order, cfrom, creply);

	}

	@GET
	@Path("texplore/people")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TwitterUser> getExploreQQQPeople(@QueryParam("user_id") int user_id,
		@QueryParam("q") String search,
		@QueryParam("cfrom") String cfrom, // ANYONE || ONLY-FOLLOWERS
		@QueryParam("creply") String creply, // ALL || ONLY-REPLIES
		@DefaultValue("0") @QueryParam("likes") int total_likes, @DefaultValue("0") @QueryParam("replies") int total_replies, @DefaultValue("0") @QueryParam("retweets") int total_retweets,
		@QueryParam("minTs") Timestamp minTimestamp, @QueryParam("from") String from, @QueryParam("to") String to,
		@QueryParam("start") int pageStart, @QueryParam("size") int pageSize
		) {

		return service.getExploreQQQPeople(user_id, search, total_likes, total_replies, total_retweets, from, to, pageStart, pageSize, cfrom, creply);

	}
	
	@GET
	@Path("xxx")
	@Produces(MediaType.APPLICATION_JSON)
	public String go() {
		return "goooo";
	}

}
