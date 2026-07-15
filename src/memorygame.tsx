
// Import React hooks
import { useState, useEffect } from "react";

// Import CSS styles
import "./MemoryGame.css";

/*
|--------------------------------------------------------------------------
| Image list
|--------------------------------------------------------------------------
| These images are placed inside:
| public/cards/
|
| The game duplicates this array later to create matching pairs.
*/
const images = [
  "/cards/apple.jpg",
  "/cards/banana.jpg",
  "/cards/cherry.jpg",
  "/cards/grapes.jpg",
  "/cards/kiwi.jpg",
  "/cards/orange.jpg",
  "/cards/pear.jpg",
  "/cards/strawberry.jpg",
];

/*
|--------------------------------------------------------------------------
| Create a shuffled deck
|--------------------------------------------------------------------------
|
| Steps:
| 1. Duplicate the image array so every image has a matching pair.
| 2. Convert each image into a card object.
| 3. Give each card a unique id.
| 4. Set default card state.
| 5. Shuffle the cards randomly.
|
*/
function createDeck() {
  return [...images, ...images]
    .map((src, index) => ({
      // Unique key used by React
      id: `${index}-${Math.random()}`,

      // Image path
      src,

      // Whether the card is currently visible
      flipped: false,

      // Whether the card has already been matched
      matched: false,
    }))

    // Shuffle cards randomly
    .sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  /*
  |--------------------------------------------------------------------------
  | React State
  |--------------------------------------------------------------------------
  */

  // Current deck of cards
  const [cards, setCards] = useState(createDeck());

  // Stores the two selected cards
  const [selected, setSelected] = useState([]);

  // Counts player moves
  const [moves, setMoves] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Card Click
  |--------------------------------------------------------------------------
  |
  | Ignore clicks when:
  | - Card is already flipped
  | - Card is already matched
  | - Two cards are already selected
  |
  */
  const handleClick = (card) => {
    if (
      card.flipped ||
      card.matched ||
      selected.length === 2
    ) {
      return;
    }

    /*
    Flip the clicked card.
    */
    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id
          ? { ...c, flipped: true }
          : c
      )
    );

    /*
    Save the selected card.
    */
    setSelected((prev) => [...prev, card]);
  };

  /*
  |--------------------------------------------------------------------------
  | Check for Matches
  |--------------------------------------------------------------------------
  |
  | Runs whenever "selected" changes.
  |
  | When exactly two cards are selected:
  | - Increase move count.
  | - Compare images.
  | - If same image:
  |     keep both cards visible.
  | - Otherwise:
  |     flip them back after delay.
  |
  */
  useEffect(() => {
    // Wait until two cards are selected
    if (selected.length !== 2) return;

    // Count a move
    setMoves((m) => m + 1);

    // Get selected cards
    const [first, second] = selected;

    /*
    -------------------------
    Cards Match
    -------------------------
    */
    if (first.src === second.src) {
      setCards((prev) =>
        prev.map((c) =>
          c.src === first.src
            ? {
                ...c,
                matched: true,
              }
            : c
        )
      );

      // Reset selection
      setSelected([]);
    }

    /*
    -------------------------
    Cards Don't Match
    -------------------------
    */
    else {
      const timer = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first.id ||
            c.id === second.id
              ? {
                  ...c,
                  flipped: false,
                }
              : c
          )
        );

        // Clear selected cards
        setSelected([]);
      }, 900);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [selected]);

  /*
  |--------------------------------------------------------------------------
  | Restart Game
  |--------------------------------------------------------------------------
  |
  | Creates a completely new shuffled deck.
  |
  */
  const restart = () => {
    setCards(createDeck());
    setSelected([]);
    setMoves(0);
  };

  /*
  |--------------------------------------------------------------------------
  | Win Condition
  |--------------------------------------------------------------------------
  |
  | If every card has matched,
  | player wins.
  |
  */
  const won = cards.every(
    (card) => card.matched
  );

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */
  return (
    <div className="game">

      {/* Game Title */}
      <h1>🧠 Memory Match Game</h1>

      {/* Top Controls */}
      <div className="top">

        {/* Move Counter */}
        <h3>Moves: {moves}</h3>

        {/* Restart Button */}
        <button onClick={restart}>
          Restart
        </button>

      </div>

      {/* Win Message */}
      {won && (
        <h2>
          🎉 You Win!
        </h2>
      )}

      {/* Card Grid */}
      <div className="grid">

        {cards.map((card) => (

          <div
            key={card.id}
            className={`card ${
              card.flipped || card.matched
                ? "flip"
                : ""
            }`}
            onClick={() =>
              handleClick(card)
            }
          >

            {/* Inner wrapper for flip animation */}
            <div className="inner">

              {/* Front side (hidden state) */}
              <div className="front">
                ?
              </div>

              {/* Back side (image) */}
              <div className="back">
                <img
                  src={card.src}
                  alt="Memory Card"
                />
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
                               }
