import { Map, fromJS } from "immutable";
import { expect } from "chai";

import reducer from "../src/reducer";

describe("reducer", () => {
  it("handles SET_ENTRIES", () => {
    const state = Map();
    const nextState = reducer(state, {
      type: "SET_ENTRIES",
      entries: ["Trainspotting", "28 Days Later"],
    });
    expect(nextState).to.equal(
      Map({
        entries: ["Trainspotting", "28 Days Later"],
      })
    );
  });

  it("handles NEXT", () => {
    const state = Map({
      entries: ["m1", "m2", "m3"],
    });
    const nextState = reducer(state, { type: "NEXT" });
    expect(nextState).to.equal(
      Map({
        entries: ["m3"],
        vote: Map({
          pair: ["m1", "m2"],
        }),
      })
    );
  });

  it("handles VOTE", () => {
    const state = fromJS({
      entries: ["m3"],
      vote: {
        pair: ["m1", "m2"],
        tally: {
          "m1": 2,
          "m2": 4
        },
      },
    });
    const nextState = reducer(state, { type: "VOTE", entry: "m1" });
    expect(nextState).to.equal(fromJS({
      entries: ["m3"],
      vote: {
        pair: ["m1", "m2"],
        tally: {
          "m1": 3,
          "m2": 4
        },
      },
    }));
  });

  it('has an initial state', () => {
    const nextState = reducer(undefined, { type: 'SET_ENTRIES', entries: ['m1'] });
    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      { type: 'SET_ENTRIES', entries: ['m1', 'm2'] },
      { type: 'NEXT' },
      { type: 'VOTE', entry: 'm1' },
      { type: 'VOTE', entry: 'm1' },
      { type: 'VOTE', entry: 'm2' },
      { type: 'VOTE', entry: 'm3' },
      { type: 'NEXT' }
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'm1'
    }));
  });
});
