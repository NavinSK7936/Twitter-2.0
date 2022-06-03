package com.spacenine.twitter;

import java.sql.Connection;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.arpit.java2blog.bean.Tweet;
import org.arpit.java2blog.service.TwitterService;
import org.joda.time.DateTime;

public class TwitterHashtagManipulator {

    private final TwitterService service;

    private static volatile boolean isStarted = false;

    public TwitterHashtagManipulator(TwitterService service) {

        this.service = service;

    }

    private Timestamp minimumTimestamp() {
        
        return new Timestamp(new DateTime().minusDays(10).toDate().getTime() / 1000l);
    
    }

    private Timestamp currentTimestamp() {

        return new Timestamp(System.currentTimeMillis());

    }

    private Double getWeight(Timestamp currentTimestamp, Timestamp tweetCreatedAt) {

        return 1.0 / Math.max(currentTimestamp.getTime() - tweetCreatedAt.getTime(), 1L);

    }

    public void start() {

        if (isStarted)
            return;

        isStarted = true;

        new Thread(new Runnable() {
			@Override
			public void run() {

            //     double weight;

            //     while (true) {

            //         Map<String, Double> hashtagsWeight = new HashMap<String, Double>();

            //         Timestamp currentTimestamp = currentTimestamp();

            //         String query = "SELECT * FROM " + TwitterUtil.tweetTable + " WHERE created_at >= '" + minimumTimestamp() + "'";

            //         for (Tweet tweet: service.getTweetsForCustomQuery(query)) {

            //             for (String hashtag: tweet.getHashtags()) {

            //                 weight = hashtagsWeight.getOrDefault(hashtag, 1.0) * getWeight(currentTimestamp, tweet.getCreated_at());

            //                 hashtagsWeight.put(hashtag, weight);

            //                 service.updateHashtagWeight(hashtag, weight);
                        
            //             }

            //         }

            //         // System.out.println(query);
            //         // System.out.println(hashtagsWeight);

            //         try { Thread.sleep(10000); }
            //         catch (InterruptedException e) { e.printStackTrace(); }

            //     }
			}

		}).start();

    }
    


}
