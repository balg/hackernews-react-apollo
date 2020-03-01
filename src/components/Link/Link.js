import React from "react";
import { AUTH_TOKEN } from "../../constants";
import { timeDifferenceForDate } from "../../utils";

const Link = props => {
  const {
    link: { description, url, votes, postedBy, createdAt },
    index
  } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const voteForLink = () => {
    console.log("voteForLink -> voteForLink", voteForLink);
  };

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={voteForLink}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {description} ({url})
        </div>
        <div className="f6 lh-copy gray">
          {votes.length} votes | by {postedBy ? postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
