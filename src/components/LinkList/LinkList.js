import React from "react";
import Link from "../Link/Link";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

export const FEED_QUERY = gql`
  {
    feed {
      links {
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
      }
    }
  }
`;

const updateCacheAfterVote = (store, createVote, linkId) => {
  const data = store.readQuery({ query: FEED_QUERY });

  const votedLink = data.feed.links.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;

  store.writeQuery({ query: FEED_QUERY, data });
};

const LinkList = props => {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Fetching...</p>;
        if (error) return <p>Error</p>;

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
