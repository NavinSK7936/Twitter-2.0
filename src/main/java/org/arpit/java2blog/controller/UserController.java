package org.arpit.java2blog.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;

import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;

import com.spacenine.rest.PATCH;

import org.arpit.java2blog.bean.Mention;
import org.arpit.java2blog.bean.TwitterUser;
import org.arpit.java2blog.service.TwitterService;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

@Path("user")
public class UserController {
	
	private final TwitterService service = new TwitterService();
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public TwitterUser addUser(TwitterUser user) {
		
		return service.addUser(user);
		
	}

	@GET
	@Path("id/{user_id}")
	@Produces(MediaType.APPLICATION_JSON)
	public TwitterUser getUserById(@PathParam("user_id") int user_id) {
		
		return service.getUser(user_id);
		
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public TwitterUser getUser(@QueryParam("id") int id) {
		
		return service.getUser(id);
		
	}
	
	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	public TwitterUser updateUser(TwitterUser user) {
		
		return service.updateUser(user);
		
	}
	
	@DELETE
	@Produces(MediaType.APPLICATION_JSON)
	public void deleteUser(@QueryParam("id") int id) {
		
		service.deleteUser(id);
		
	}
	
	@PATCH
	@Path("status")
	@Produces(MediaType.APPLICATION_JSON)
	public String updateStauts(@QueryParam("user_id") int user_id, String status) {
		
		return service.updateStatus(user_id, status);
		
	}
	
	@POST
	@Path("follow")
	@Produces(MediaType.APPLICATION_JSON)
	public int follow(@QueryParam("follower_id") int follower_id, @QueryParam("followee_id") int followee_id) {
		
		return service.follow(follower_id, followee_id);
		
	}
	
	@DELETE
	@Path("unfollow")
	@Produces(MediaType.APPLICATION_JSON)
	public int unfollow(@QueryParam("follower_id") int follower_id, @QueryParam("unfollowee_id") int unfollowee_id) {
		
		return service.unfollow(follower_id, unfollowee_id);
		
	}

	@GET
	@Path("isfollow")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean isFollowing(@QueryParam("user_id") String user_id, @QueryParam("followee_id") String followee_id) {

		return service.isFollowing(Integer.parseInt(user_id), Integer.parseInt(followee_id));

	}

	@GET
	@Path("mention")
	@Produces(MediaType.APPLICATION_JSON)
	public String getMentionNameFromId(@QueryParam("id") int id) {

		return service.getMentionNameFromId(id);

	}

	@GET
	@Path("rmentions")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Mention> getRecommendedMentions(
		@QueryParam("wildcard") String wildcard,
		@QueryParam("user_id") int user_id,
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize) {
		
		return service.getRecommendedMentions(wildcard, user_id, pageStart, pageSize);
		
	}

	@POST
	@Path("relate")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean relateUsers(@QueryParam("from_user") int from_user, @QueryParam("to_user") int to_user) {
		
		return service.relateUsers(from_user, to_user);
		
	}

	@GET
	@Path("profile/followees")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TwitterUser> getFolloweesForProfileFollowerOf(
		@QueryParam("user_id") int user_id,
		@QueryParam("follower_id") int follower_id, 
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize) {
		
		return service.getFolloweesForProfileFollowerOf(user_id, follower_id, pageStart, pageSize);
		
	}

	@GET
	@Path("profile/followers")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TwitterUser> getFollowersForProfileFollowerOf(
		@QueryParam("user_id") int user_id,
		@QueryParam("followee_id") int followee_id, 
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize) {
		
		return service.getFollowersForProfileFollowerOf(user_id, followee_id, pageStart, pageSize);
		
	}

	@GET
	@Path("profile/followers/known")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TwitterUser> getFollowersYouKnowFor(
		@QueryParam("user_id") int user_id,
		@QueryParam("that_id") int that_id, 
		@QueryParam("start") int pageStart,
		@QueryParam("size") int pageSize) {
		
		return service.getFollowersYouKnowFor(user_id, that_id, pageStart, pageSize);
		
	}
	

	@GET
	@Path("db")
	@Produces(MediaType.APPLICATION_JSON)
	public int getUserIdByNameAndPassword(@QueryParam("username") String username, @QueryParam("password") String password) {

		return service.getUserIdByNameAndPassword(username, password);

	}

	@POST
	@Path("pic")
	public void getMsg(@FormParam("imgFileId") File file) {//HttpServletRequest request) {

		JSONArray list = new JSONArray();
		JSONObject obj = new JSONObject();

		System.out.println(file);

		// String saveFile = "", contentType = request.getContentType();
		// if (contentType != null && contentType.indexOf("multipport/form-data") >= 0) {
		// 	try {
		// 		DataInputStream in = new DataInputStream(request.getInputStream());

		// 		int formDataLength = request.getContentLength(), byteRead = 0, totalBytesRead = 0;
		// 		byte dataBytes[] = new byte[formDataLength];

		// 		while (totalBytesRead < formDataLength) {
		// 			byteRead = in.read(dataBytes, totalBytesRead, formDataLength);
		// 			totalBytesRead += byteRead;
		// 		}

		// 		String file = new String(dataBytes);
		// 		saveFile = file.substring(file.indexOf("filename=\"") + 10);
		// 		saveFile

		// 	} catch (IOException e) {
		// 		// TODO Auto-generated catch block
		// 		e.printStackTrace();
		// 	}
		// }


		

	}

}
