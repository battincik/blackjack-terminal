# Blackjack Game

This project is a simple Node.js implementation of the classic Blackjack card game. It's a Blackjack game developed using Node.js, playable through the terminal.

## Installation

Follow these steps to install and run the project locally:

1. Clone the project:
   ```
   git clone [project-link]
   ```
2. Start the application:
   ```
   node blackjack.js
   ```

## Features of the Blackjack Game:

1. Card and Deck Implementation: The game includes a Card class representing individual playing cards and a Deck class that creates a standard deck of cards. The deck includes all suits (Hearts, Diamonds, Clubs, Spades) and values (2-10, Jack, Queen, King, Ace).

2. Shuffling and Dealing: The Deck class has a shuffle method to randomize the order of the cards, and a deal method for dealing cards from the deck.

3. Player and Dealer Hands: The game manages both player and dealer hands. Each hand can contain multiple cards, and there is functionality to calculate the value of a hand, including special handling for Aces (which can be worth 1 or 11).

4. Gameplay Mechanics: Players can choose from several actions during their turn, including hitting (taking another card), standing (ending their turn), doubling down (doubling their bet with one additional card), and splitting (if they have a pair). The dealer plays according to fixed rules, hitting until reaching a certain hand value.

5. Blackjack Checks: The game includes checks for Blackjack (an Ace with a 10 or face card), which is a winning condition.

6. End-of-Game Evaluation: At the end of each game, the hand values of the player and dealer are compared to determine the outcome (player win, dealer win, or tie).

7. Console-Based Interface: The game is designed to be played in a console, with text output describing the state of the game and text input for player decisions.

8. Replayability: After a game concludes, players are given the option to play another round or quit.

9. Error Handling and Input Validation: The game includes some basic input validation and error handling to ensure a smooth gameplay experience.

10. Game State Management: The game maintains the state of the deck, player hands, dealer hand, and other relevant information, resetting appropriately at the beginning of each new game.


## How to Play the Blackjack Game:

1. Start the Game:
   - The game is initiated with a shuffled deck of cards.
   - The player and the dealer each start with a hand of cards.

2. Initial Cards:
   - The player is dealt two cards from the deck.
   - The dealer is dealt one card.

3. Check for Blackjack:
   - If the player's initial two cards are an Ace and a 10 or face card (Blackjack), the player wins automatically.

4. Player's Turn:
   - The player has the option to:
     a. Hit: Draw another card from the deck.
     b. Stand: Keep the current hand and end the turn.
     c. Double Down: Double the bet and take exactly one more card.
     d. Split: If the two cards have the same value, split them into two separate hands (only available on the first action of a hand).

5. Dealer's Turn:
   - The dealer draws cards until the total value is 17 or higher.

6. End of Game:
   - Once both the player and dealer have finished their turns, the values of their hands are compared.
   - The hand with the value closest to 21 without exceeding it wins.

7. Determining the Outcome:
   - If the player's hand value exceeds 21, the player busts and loses.
   - If the dealer's hand value exceeds 21 and the player's hand does not, the player wins.
   - If both the player and dealer have the same hand value, the game is a tie.
   - Otherwise, the hand closest to 21 wins.

8. Replay or Quit:
   - After the game concludes, the player can choose to play another round or quit the game.


## License

This project is licensed under the [MIT License](LICENSE).
