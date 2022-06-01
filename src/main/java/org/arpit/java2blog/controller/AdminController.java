package org.arpit.java2blog.controller;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.arpit.java2blog.bean.CompleteTweet;
import org.arpit.java2blog.bean.Tweet;
import org.arpit.java2blog.service.TwitterService;

import org.arpit.java2blog.bean.TwitterUser;

@Path("admin")
public class AdminController {
	
	private final TwitterService service = new TwitterService();
	
	@GET
	@Path("users")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TwitterUser> getAllUsers() {
		
		return service.getAllUsers();
		
	}
	
	@GET
	@Path("tweets/all")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Tweet> getAllTweets() {
		
		return service.getAllTweets();
		
	}
	
	@POST
	@Path("tweet")
	@Produces(MediaType.APPLICATION_JSON)
	public Tweet addTweet(Tweet tweet) {
		
		return service.addTweetByAdmin(tweet);
		
	}
	
	@DELETE
	@Path("delete")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean deleteTweet(@QueryParam("tweet_id") int tweet_id) {
		
		return service.deleteTweetByAdmin(tweet_id);
		
	}
	
	@GET
	@Path("hashtags/all")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> getAllHashtags() {
		
		return service.getAllHashtags();
		
	}
	
}
