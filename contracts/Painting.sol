// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

struct Pixel {
    uint16 x;
    uint16 y;
    bytes3 color;
}

struct Details {
    uint16 x;
    uint16 y;
    uint200 timesPainted;
    bytes3 color;
    address author;
}

/**
 * @dev A two dimensional painting, each pixel can have a specific color.
 *
 *  The painting size is 400x400 pixels.
 *  The first time a pixel is painted is free but to re-paint a pixel
 *  it is required to pay the respective `price`.
 */
contract Painting is ReentrancyGuard {
    address private owner;
    uint256 constant basePrice = 0.00001 ether;

    mapping(bytes => Details) pixels;

    event PixelPainted(uint16 x, uint16 y);

    constructor() {
        owner = msg.sender;
    }

    function id(uint256 x, uint256 y)
        internal
        view
        virtual
        returns (bytes memory)
    {
        return abi.encodePacked(x, y);
    }

    function price(uint256 timesPainted) internal pure returns (uint256) {
        if (timesPainted == 0) {
            return 0;
        } else if (timesPainted >= 11) {
            return 100000 ether;
        }

        return basePrice * 10**timesPainted;
    }

    /**
     * @dev Internal paint function, called by 'paint'.
     *
     * Update the pixel information and pay the previous author when the pixel is already painted (position > 0).
     * Otherwise, create the new pixel.
     * Returns the spent funds.
     */
    function paintPixel(
        uint16 x,
        uint16 y,
        bytes3 color,
        uint256 funds
    ) internal returns (uint256) {
        require(x < 400 && y < 400, "Coordinates out of range");

        bytes memory pixelId = id(x, y);
        Details memory pixel = pixels[pixelId];

        emit PixelPainted(x, y);

        if (pixel.timesPainted > 0) {
            uint256 expense = price(pixel.timesPainted);

            require(
                funds >= expense && funds - expense >= 0,
                "Not enough funds"
            );

            payable(pixel.author).transfer((expense * 3) / 4);

            pixel.timesPainted++;
            pixel.color = color;
            pixel.author = msg.sender;

            pixels[pixelId] = pixel;

            return expense;
        }

        pixels[pixelId] = Details(x, y, 1, color, msg.sender);

        return 0;
    }

    /**
     * @dev The painting function.
     *
     * It goes through the 'pixelsToPaint' array and tries to paint them with the received value.
     * Reverts if there's not enough funds to cover the expense.
     */
    function paint(Pixel[] memory pixelsToPaint) public payable nonReentrant {
        uint256 funds = msg.value;

        for (uint256 i = 0; i < pixelsToPaint.length; i++) {
            Pixel memory pixelToPaint = pixelsToPaint[i];

            funds -= paintPixel(
                pixelToPaint.x,
                pixelToPaint.y,
                pixelToPaint.color,
                funds
            );
        }
    }

    function list(
        uint256 x0,
        uint256 y0,
        uint256 x1,
        uint256 y1
    ) public view virtual returns (Details[] memory) {
        require(x1 > x0 && y1 > y0);
        require(x0 >= 0 && y0 >= 0);
        require(x1 <= 400 && y1 <= 400);

        Details[] memory result = new Details[]((x1 - x0) * (y1 - y0));
        uint256 index = 0;

        for (uint256 x = x0; x < x1; x++) {
            for (uint256 y = y0; y < y1; y++) {
                result[index] = pixels[id(x, y)];
                index++;
            }
        }

        return result;
    }

    function details(uint16 x, uint16 y)
        public
        view
        virtual
        returns (Details memory)
    {
        return pixels[id(x, y)];
    }

    function withdraw(uint256 funds) external {
        require(msg.sender == owner);

        payable(owner).transfer(funds);
    }

    receive() external payable {}
}
