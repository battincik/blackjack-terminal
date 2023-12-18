const readline = require('readline');

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    getCardString() {
        return `${this.value} of ${this.suit}`;
    }
}

class Deck {
    constructor() {
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];

        for (let suit of this.suits) {
            for (let value of this.values) {
                this.deck.push(new Card(suit, value));
            }
        }
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    deal() {
        return this.deck.pop();
    }
}

class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    getHandString() {
        return this.cards.map(card => card.getCardString()).join(', ');
    }

    getHandValue() {
        let value = 0;
        let aceCount = 0;

        for (let card of this.cards) {
            if (['J', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else if (card.value === 'A') {
                aceCount++;
                value += 11;
            } else {
                value += parseInt(card.value);
            }
        }

        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount--;
        }

        let alternateValue = value;
        for (let i = 0; i < aceCount; i++) {
            alternateValue -= 10;
        }

        return { value, alternateValue };
    }

    getHandValueString() {
        const handValue = this.getHandValue();
        return handValue.value !== handValue.alternateValue ? `${handValue.value}/${handValue.alternateValue}` : `${handValue.value}`
    }

    canSplit() {
        return this.cards.length === 2 && this.cards[0].value === this.cards[1].value;
    }

    isBlackjack() {
        return this.cards.length === 2 && this.getHandValue().value === 21;
    }
}

class BlackjackGame {
    constructor() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.playerHands = [new Hand()];
        this.dealerHand = new Hand();
        this.currentHandIndex = 0;
        this.isDoubleDown = false;
        this.result = '';
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.startGame();
    }

    startGame() {
        this.clearGame();
        console.clear();
        this.playerHands[0].addCard(this.deck.deal());
        this.playerHands[0].addCard(this.deck.deal());
        this.dealerHand.addCard(this.deck.deal());

        if (this.playerHands[0].isBlackjack()) {
            console.log("Blackjack! Player wins!");
            this.result = 'Blackjack! Player wins!';
            this.showHands();
            this.askForNewGame();
        } else {
            this.play();
        }
    }

    showHands() {
        console.clear();
        console.log(this.result);
        this.playerHands.forEach((hand, index) => {
            console.log(`\n------------------- Player's Hand (${hand.cards.length === 2 ? hand.getHandValue() === 21 ? "Blackjack!" : hand.getHandValueString() : hand.getHandValueString()}) ------------------- ${hand.canSplit() ? "(Can Split)" : ""}`);
            console.log(`${hand.getHandString()}`);
        });
        console.log(`\n------------------- Dealer's Hand (${this.dealerHand.getHandValueString()}) -------------------`);
        console.log(`${this.dealerHand.getHandString()}`);
        console.log("\n-----------------------------------------------------\n");
    }

    checkForEndOfGame() {
        return this.playerHands.every(hand => hand.getHandValue() > 21);
    }

    playerOptions(handIndex) {
        const hand = this.playerHands[handIndex];
        const options = {
            'h': 'hit',
            's': 'stand',
            'd': 'double',
            'p': 'split',
            '': 'stand'
        };
        if (hand.canSplit() && this.playerHands.length === 1) {
            options['p'] = 'split';
        }
        if (hand.cards.length === 2) {
            options['d'] = 'double';
        }
        return options;
    }

    playerTurn() {
        const hand = this.playerHands[this.currentHandIndex];
        this.showHands();
        const options = this.playerOptions(this.currentHandIndex);
        this.rl.question(`#${this.currentHandIndex + 1}, choose an action ([H] Hit / [S] Stand / [D] Double Down / [P] Split): `, (answer) => {
            const action = options[answer.toLowerCase()];
            switch (action) {
                case 'hit':
                    hand.addCard(this.deck.deal());
                    if (hand.getHandValue().value > 21) {
                        console.log(`Hand ${this.currentHandIndex + 1} busted!`);
                        this.nextHandOrDealerTurn();
                    } else {
                        this.playerTurn();
                    }
                    break;
                    case 'stand':
                        this.nextHandOrDealerTurn();
                        break;
                    case 'double':
                        this.isDoubleDown = true;
                        hand.addCard(this.deck.deal());
                        console.log(`Hand ${this.currentHandIndex + 1} after double down: ${hand.getHandString()}`);
                        this.nextHandOrDealerTurn();
                        break;
                    case 'split':
                        if (hand.canSplit()) {
                            this.splitHand(this.currentHandIndex);
                        } else {
                            console.log('You can\'t split this hand.');
                            this.playerTurn();
                        }
                        break;
                    default:
                        console.log('Invalid option.');
                        this.playerTurn();

                }
            });
    }

    nextHandOrDealerTurn() {
        if (this.currentHandIndex < this.playerHands.length - 1) {
            this.currentHandIndex++;
            this.playerTurn();
        } else {
            this.dealerTurn();
        }
    }

    splitHand(handIndex) {
        const hand = this.playerHands[handIndex];
        const newHand = new Hand();
        newHand.addCard(hand.cards.pop());
        newHand.addCard(this.deck.deal());
        hand.addCard(this.deck.deal());

        this.playerHands.push(newHand);
        this.playerTurn();
    }

    dealerTurn() {
        console.log("Dealer's turn.");
        while (this.dealerHand.getHandValue().value < 17) {
            this.dealerHand.addCard(this.deck.deal());
        }
        this.endGame();
    }

    endGame() {
        this.showHands();
        this.playerHands.forEach((hand, index) => {
            const playerValues = hand.getHandValue();
            const dealerValues = this.dealerHand.getHandValue();
            console.log(`Hand ${index + 1}:`);

            // El değerlerini karşılaştır
            if (playerValues.value > 21) {
                this.result = 'Busted! Dealer wins.';
                console.log("Busted! Dealer wins.");
            } else if (dealerValues.value > 21 || playerValues.value > dealerValues.value) {
                this.result = 'Player wins!';
                console.log("Player wins!");
            } else if (dealerValues.value > playerValues.value) {
                this.result = 'Dealer wins!';
                console.log("Dealer wins!");
            } else if (playerValues.value === dealerValues.value) {
                this.result = 'It\'s a tie!';
                console.log("It's a tie!");
            } else {
                this.result = 'Dealer wins!';
                console.log("Dealer wins!");
            }
        });
        this.showHands();
        this.askForNewGame();
    }

    play() {
        this.playerTurn();
    }

    clearGame() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.playerHands = [new Hand()];
        this.dealerHand = new Hand();
        this.currentHandIndex = 0;
        this.isDoubleDown = false;
        this.result = '';
    }

    askForNewGame() {
        this.rl.question('\nPress q to quit, or any other key to continue: ', (answer) => {
            // 1 or enter 
            if (answer === 'q') {
                this.rl.close();
                return;
            } else {
                console.clear();
                this.startGame();
            }
        });
    }
}

new BlackjackGame();