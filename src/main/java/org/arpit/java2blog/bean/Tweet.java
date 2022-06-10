package org.arpit.java2blog.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.xml.bind.annotation.XmlRootElement;

import com.spacenine.twitter.Util;

@XmlRootElement
public class Tweet implements Serializable {

	private static final long serialVersionUID = 1456436903829146221L;
	
	private int id;
	private int user_id;
	private String quote;
	private int total_likes;
	private int total_retweets;
	private int total_replies;
	private Timestamp created_at;
	private int source_label;
	private int who_can_reply;

	public Tweet() {
	}

	public Tweet(int id, int user_id, String quote, int total_likes, 
			int total_retweets, int total_replies, Timestamp created_at, int source_label, int who_can_reply) {
		super();
		this.id = id;
		this.user_id = user_id;
		this.quote = quote;
		this.total_likes = total_likes;
		this.total_retweets = total_retweets;
		this.total_replies = total_replies;
		this.created_at = created_at;
		this.source_label = source_label;
		this.who_can_reply = who_can_reply;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getQuote() {
		return quote;
	}

	public void setQuote(String quote) {
		this.quote = quote;
	}

	public int getTotal_likes() {
		return total_likes;
	}

	public void setTotal_likes(int total_likes) {
		this.total_likes = total_likes;
	}

	public int getTotal_replies() {
		return total_replies;
	}

	public void setTotal_replies(int total_replies) {
		this.total_replies = total_replies;
	}

	public int getTotal_retweets() {
		return total_retweets;
	}

	public void setTotal_retweets(int total_retweets) {
		this.total_retweets = total_retweets;
	}
	
	public Timestamp getCreated_at() {
		return created_at;
	}

	public void setCreated_at(Timestamp created_at) {
		this.created_at = created_at;
	}

	public int getSource_label() {
		return source_label;
	}

	public void setSource_label(int source_label) {
		this.source_label = source_label;
	}

	public int getWho_can_reply() {
		return who_can_reply;
	}

	public void setWho_can_reply(int who_can_reply) {
		this.who_can_reply = who_can_reply;
	}
	
	
	// TODO: Must sort it deeper
	public Set<String> getHashtags() {

		Set<String> hashtags = new HashSet<String>();

		if (quote == null)
			return hashtags;

		Stream<String> s = Arrays.stream(quote.split(" ")).filter(new Predicate<String>() {
			@Override
			public boolean test(String word) {
				return word.startsWith("#");
			}
		});
		
		for (Object hashtag: s.toArray())
			hashtags.add((String) hashtag);

		return hashtags;

	}

	public Set<Integer> getMentions() {

		Set<Integer> mentions = new HashSet<>();

		if (quote == null)
			return mentions;

		int id;
		for (String word: quote.split(" ")) {
			id = Util.getMentionId(word);
			if (~id != 0)
				mentions.add(id);
		}

		return mentions;
	}

	@Override
	public String toString() {
		return "Tweet [created_at=" + created_at + ", id=" + id + ", quote=" + quote + ", total_likes=" + total_likes
				+ ", total_replies=" + total_replies + ", total_retweets=" + total_retweets + ", user_id=" + user_id + ", source_label=" + source_label
				+ ", hashtags=" + getHashtags()
				+ "]";
	}

	

}
