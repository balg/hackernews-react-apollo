import React from "react";
import Link from "../Link/Link";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { LINKS_PER_PAGE } from "../../constants";
import Paging from "./Paging/Paging";

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
  }
`;

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        ...FeedLink
      }
      count
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
  const data = store.readQuery({ query: FEED_QUERY });

  const votedLink = data.feed.links.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;

  store.writeQuery({ query: FEED_QUERY, data });
};

const subscribeToNewLinks = subscribeToMore => {
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      return {
        ...prev,
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      };
    }
  });
};

const subscribeToNewVotes = subscribeToMore => {
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });
};

const LinkList = props => {
  const isNewPage = props.location.pathname.includes("new");
  const page = parseInt(props.match.params.page, 10);
  const firstIndexOnPage = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const getQueryVariables = () => {
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? "createdAt_DESC" : null;
    return { first, skip, orderBy };
  };

  const getLinksToRender = data => {
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = [...data.feed.links]
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  return (
    <Query query={FEED_QUERY} variables={getQueryVariables()}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <p>Fetching...</p>;
        if (error) return <p>Error</p>;

        subscribeToNewLinks(subscribeToMore);
        subscribeToNewVotes(subscribeToMore);

        const linksToRender = getLinksToRender(data);

        return (
          <>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + firstIndexOnPage}
                updateStoreAfterVote={updateCacheAfterVote}
              />
            ))}
            {isNewPage && (
              <Paging previousPage={() => {}} nextPage={() => {}} />
            )}
          </>
        );
      }}
    </Query>
  );
};

export default LinkList;
