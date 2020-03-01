import React, { useState } from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import { FEED_QUERY } from "../LinkList/LinkList";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const updateCacheAfterCreateLink = (store, { data: { post } }) => {
  const data = store.readQuery({ query: FEED_QUERY })
  data.feed.links.unshift(post)
  store.writeQuery({
    query: FEED_QUERY,
    data
  })
}

const CreateLink = props => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={() => props.history.push('/')}
        update={updateCacheAfterCreateLink}
      >
        {postMutation => <button onClick={postMutation}>Submit</button>}
      </Mutation>
    </div>
  );
};

export default CreateLink;
