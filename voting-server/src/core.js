import { List, Map } from "immutable";

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set("entries", List(entries));
}

function getWinner(vote) {
  if (!vote) return null;
  const [a, b] = vote.get("pair");
  if (vote.getIn(["tally", a, 0]) > vote.getIn(["tally", b, 0])) {
    return a;
  }
  if (vote.getIn(["tally", b, 0]) > vote.getIn(["tally", a, 0])) {
    return b;
  }
  return [a, b];
}

export function next(state) {
  const entries = state.get("entries").concat(getWinner(state.get("vote")));
  if (entries.size === 1) {
    return state
      .remove("vote")
      .remove("entries")
      .set("winner", entries.first());
  }
  return state.merge({
    pair: Map({
      pair: entries.take(2),
    }),
    entries: entries.skip(2),
  });
}

export function vote(state, entry) {
  if (state.getIn(["vote", "pair"]).includes(entry)) {
    return state.updateIn(["vote", "tally", entry], 1, (tally) => tally + 1);
  }
  return state;
}
