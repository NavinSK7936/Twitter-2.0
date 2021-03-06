package com.spacenine.twitter;

public final class TwitterUtil {
	
	public static final String mySqlUserName = "root", mySqlPassword = "sknavin@369", mySqlDbName = "twitter";
	
	public static final String followerTable = "follower_table", tweetTable = "tweet_table", userTable = "user_table";
	
	public static final String likesTable = "likes_table", replyTable = "reply_table", retweetTable = "retweet_table", only_retweet_table = "only_retweet_table";

	public static final String hashtagsTable = "hashtags_table", hash_tweet_table = "hash_tweet_table", mention_tweet_table = "mention_tweet_table";
	
	public static final String user_meta_table = "user_meta_table", status_hash_table = "status_hash_table", status_mention_table = "status_mention_table";

	public static final String mention_trend_table = "mention_trend_table", user_rel_table = "user_rel_table";
	
	public static final String RECENT_FEEDS = "recent", POPULAR_FEEDS = "popular", OLD_FEEDS = "old";
	
	public static final String[] sourceLabels = {
													"Twitter for Terminal",
													"Twitter Web App"
												};

	public static final String[] whoCanReply = {
													"Everyone",
													"People you follow",
													"Only People you mention"
												};
}
