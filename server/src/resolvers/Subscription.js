function newLinkSubscribe(parent, args, context, info) {
  const log = context.prisma.$subscribe
    .link({ mutation_in: ["CREATED"] })
    .node();
  console.log({ log });
  return log;
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => {
    console.log(payload);
    return {
      ...payload,
      feed: {
        id: 1
      }
    };
  }
};

function newVoteSubscribe(parent, args, context, info) {
  return context.prisma.$subscribe.vote({ mutation_in: ["CREATED"] }).node();
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: payload => {
    return payload;
  }
};

module.exports = {
  newLink,
  newVote
};
