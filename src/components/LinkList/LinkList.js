import React from "react";
import Link from "../Link/Link";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

const LinkList = props => {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Fetching...</p>;
        if (error) return <p>Error</p>;

        const linksToRender = data.feed.links;

        return (
          <div>
            {linksToRender.map(link => (
              <Link key={link.id} link={link} />
            ))}
          </div>
        );
      }}
    </Query>
  );
};

export default LinkList;
