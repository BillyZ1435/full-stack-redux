import { List, Map } from "immutable";
import { expect } from "chai";
import { setEntries, next } from "../src/core";

describe("application logic", () => {
  describe("setEntries", () => {
    it("adds the entries to the state", () => {
      const state = Map();
      const entries = List.of("Trainspotting", "28 Days Later");
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(
        Map({
          entries: List.of("Trainspotting", "28 Days Later"),
        })
      );
    });

    it("converts to immutable", () => {
      const state = Map();
      const entries = ["Trainspotting", "28 Days Later"];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(
        Map({
          entries: List.of("Trainspotting", "28 Days Later"),
        })
      );
    });
  });

  describe("next", () => {
    it("takes the next two entries under vote", () => {
      const state = Map({
        entries: List.of("Trainspotting", "28 Days Later", "Sunshine"),
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          vote: Map({
            pair: List.of("Trainspotting", "28 Days Later"),
          }),
          entries: List.of("Sunshine"),
        })
      );
    });

    it("puts winner back in to end of entries", () => {
      const state = Map({
        entries: List.of("3", "4", "5"),
        vote: Map({
          pair: List.of("1", "2"),
          tally: Map({
            1: 4,
            2: 2,
          }),
        }),
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          entries: List.of("5", "1"),
          vote: Map({
            pair: List.of("3", "4"),
          }),
        })
      );
    });

    it("puts both back in entries if tie", () => {
      const state = Map({
        entries: List.of("3", "4", "5"),
        vote: Map({
          pair: List.of("1", "2"),
          tally: Map({
            1: 4,
            2: 4,
          }),
        }),
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          entries: List.of("5", "1", "2"),
          vote: Map({
            pair: List.of("3", "4"),
          }),
        })
      );
    });

    it("puts the two entries back when no vote has been cast", () => {
      const state = Map({
        entries: List.of("3", "4", "5"),
        vote: Map({
          pair: List.of("1", "2"),
        }),
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          entries: List.of("5", "1", "2"),
          vote: Map({
            pair: List.of("3", "4"),
          }),
        })
      );
    });

    it("ends the vote immediately when there is only one entry", () => {
      const state = Map({
        entries: List.of("1"),
        vote: Map(),
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          winner: "1",
        })
      );
    });
  });

  it("e");

  describe("vote", () => {
    it("creates a new tally", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Trainspotting", "28 Days Later"),
        }),
      });
      const nextState = vote(state, "28 Days Later");
      expect(nextState).to.equal(
        Map({
          vote: Map({
            pair: List.of("Trainspotting", "28 Days Later"),
            tally: Map({
              "28 Days Later": 1,
            }),
          }),
        })
      );
    });

    it("increments the existing tally", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Trainspotting", "28 Days Later"),
          tally: Map({
            "28 Days Later": 1,
          }),
        }),
      });
      const nextState = vote(state, "28 Days Later");
      expect(nextState).to.equal(
        Map({
          vote: Map({
            pair: List.of("Trainspotting", "28 Days Later"),
            tally: Map({
              "28 Days Later": 2,
            }),
          }),
        })
      );
    });

    it("does not create a new tally for entries not in the pair", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Trainspotting", "28 Days Later"),
          tally: Map({
            "28 Days Later": 1,
          }),
        }),
      });
      const nextState = vote(state, "Sunshine");
      expect(nextState).to.equal(state);
    });

    it("does not increment the tally for entries not in the pair", () => {
      const state = Map({
        vote: Map({
          pair: List.of("Trainspotting", "28 Days Later"),
          tally: Map({
            "28 Days Later": 1,
          }),
        }),
      });
      const nextState = vote(state, "Sunshine");
      expect(nextState).to.equal(state);
    });
  });
});
