import React from "react";
import Link from "../Link/Link";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

const linkFragment = gql`
  fragment FeedLink on Link {
    id
    createdAt
    url
    description
    votes {
      id
      user {
        id
      }
    }
    postedBy {
      id
      name
    }
    feed {
      id
    }
  }
`;

export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        ...FeedLink
      }
    }
  }
  ${linkFragment}
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      ...FeedLink
    }
  }
  ${linkFragment}
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        ...FeedLink
      }
      user {
        id
      }
    }
  }
  ${linkFragment}
`;

const updateCacheAfterVote = (store, createVote, linkId) => {
  console.log("updateCacheAfterVote");
  const data = store.readQuery({ query: FEED_QUERY });

  const votedLink = data.feed.links.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;

  store.writeQuery({ query: FEED_QUERY, data });
};

const subscribeToNewLinks = subscribeToMore => {
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION
    // updateQuery: (prev, { subscriptionData }) => {
    //   console.log(subscriptionData);
    //   if (!subscriptionData.data) return prev;
    //   const newLink = subscriptionData.data.newLink;
    //   const exists = prev.feed.links.find(({ id }) => id === newLink.id);
    //   if (exists) return prev;

    //   return {
    //     ...prev,
    //     feed: {
    //       links: [newLink, ...prev.feed.links],
    //       count: prev.feed.links.length + 1,
    //       __typename: prev.feed.__typename
    //     }
    //   };
    // }
  });
};

const subscribeToNewVotes = subscribeToMore => {
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });
};

const LinkList = props => {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data, subscribeToMore }) => {
        console.log(data);
        if (loading) return <p>Fetching...</p>;
        if (error) return <p>Error</p>;

        subscribeToNewLinks(subscribeToMore);
        subscribeToNewVotes(subscribeToMore);

        const linksToRender = data.feed.links;

        return (
          <div>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index}
                updateStoreAfterVote={updateCacheAfterVote}
              />
            ))}
          </div>
        );
      }}
    </Query>
  );
};

export default LinkList;
