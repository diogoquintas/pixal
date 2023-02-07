## What is this?
This is an interactive painting for everyone. It is a square canvas which measures 400x400 pixels. Every pixel can be painted, selecting a specific color.

The cool part is that the canvas is yours, it's out there, distributed, more specifically, in the Ethereum blockchain.

## Rules
The blank space is free. Unleash your creativity.

As a sign of respect to the person who painted before you, if you want to repaint a pixel you need to pay.

75% of that value goes to the previous painter.

The contract is fairly simple but you should still read it before painting. It was not audited.

It was deployed in Arbitrum. In case this is your first time connecting to Arbitrum, follow this Arbitrum bridge tutorial.

## Pixelnomics
The price of each pixel starts at 0 ETH and it increases exponentially each time it is painted.

The formula to calculate the price of a pixel is:

Price = 0.00001 ETH * 10^t, where 't' is the times it was previously painted.

The price is capped at t = 11, in other words, the maximum price a pixel can have is 1.000.000 ETH.

Every time a pixel is painted, the previous author of that pixel (if it exists) will receive three quarters of the amount payed to re-paint the pixel.

**Experimental version**
This interface is currently on an early experimental version. We're working out some compatibility issues across devices and browsers as well as different wallets. For now, we recommend you to access the application in a desktop using Chrome/Brave with the Metamask extension.
