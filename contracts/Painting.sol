// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct PixelInformation {
    uint16 x;
    uint16 y;
    bytes3 color;
    uint256 timesPainted;
    address payable author;
}

struct Pixel {
    uint16 x;
    uint16 y;
    bytes3 color;
}

/**
 * @dev A two dimensional painting, each pixel can have a specific color.
 *
 *  The painting size is 1000x1000 pixels.
 *  The first time a pixel is painted is free but to re-paint a pixel
 *  it is required to pay the respective `pixelPrice`.
 */
contract Painting is ReentrancyGuard, Ownable {
    uint256 constant referencePrice = 0.00001 ether;

    PixelInformation[] pixels;

    /// Mapping between a pixel coordinate and its corresponding position in 'pixels' array.
    /// Usefull to check if a pixel is painted.
    mapping(bytes => uint256) pixelPositions;

    event PixelPainted(uint16 x, uint16 y);

    function pixelId(uint16 x, uint16 y)
        internal
        view
        virtual
        returns (bytes memory)
    {
        return abi.encodePacked(x, y);
    }

    function pixelPosition(uint16 x, uint16 y) internal view returns (uint256) {
        bytes memory id = pixelId(x, y);

        return pixelPositions[id];
    }

    function pixelInfo(uint16 x, uint16 y)
        public
        view
        virtual
        returns (PixelInformation memory)
    {
        uint256 position = pixelPosition(x, y);

        require(position > 0, "Pixel does not exist");

        return pixels[position - 1];
    }

    function pixelPrice(uint256 timesPainted) internal pure returns (uint256) {
        if (timesPainted >= 11) {
            return referencePrice * 10**11;
        }

        return referencePrice * 10**timesPainted;
    }

    function authorCut(uint256 price) internal pure returns (uint256) {
        return (price * 3) / 4;
    }

    /**
     * @dev Internal paint function, called by 'paintPixels'.
     *
     * Update the pixel information and pay the previous author when the pixel is already painted (position > 0).
     * Otherwise, create the new pixel.
     * Emits an event when a pixel is painted which is useful for frontend applications to know they should re-render that specific pixel.
     * Returns the spent funds.
     */
    function paint(
        uint16 x,
        uint16 y,
        bytes3 color,
        uint256 funds
    ) internal returns (uint256) {
        require(x < 1000 && y < 1000, "Coordinates out of range");

        uint256 position = pixelPosition(x, y);

        if (position > 0) {
            uint256 index = position - 1;
            uint256 price = pixelPrice(pixels[index].timesPainted);
            address payable previousAuthor = pixels[index].author;

            require(funds >= price && funds - price >= 0, "Not enough funds");

            pixels[index].color = color;
            pixels[index].author = payable(msg.sender);
            pixels[index].timesPainted += 1;

            previousAuthor.transfer(authorCut(price));

            emit PixelPainted(x, y);

            return price;
        } else {
            pixelPositions[pixelId(x, y)] = pixels.length + 1;
            pixels.push(PixelInformation(x, y, color, 1, payable(msg.sender)));

            emit PixelPainted(x, y);

            return 0;
        }
    }

    /**
     * @dev The painting function.
     *
     * It goes through the 'pixelsToPaint' array and tries to paint them with the received value.
     * Reverts if there's not enough funds to cover the expense.
     */
    function paintPixels(Pixel[] memory pixelsToPaint)
        public
        payable
        nonReentrant
    {
        uint256 funds = msg.value;

        for (uint256 i = 0; i < pixelsToPaint.length; i++) {
            uint256 expendedFunds = paint(
                pixelsToPaint[i].x,
                pixelsToPaint[i].y,
                pixelsToPaint[i].color,
                funds
            );

            funds -= expendedFunds;
        }
    }

    /**
     * @dev The listing function, it returns the current painting state as an array of `PixelInformation`.
     *
     * Contract function calls have a data size limit, for that reason, this function accepts a 'page' and 'pageSize'.
     * Those arguments can be used (coupled with 'pixelsCount') to get the painting data in digestible chunks.
     */
    function pixelsInfo(uint256 page, uint256 pageSize)
        public
        view
        virtual
        returns (PixelInformation[] memory)
    {
        require(page > 0, "Page must be higher than 0");

        PixelInformation[] memory result = new PixelInformation[](pageSize);
        uint256 pixelIndex = (page - 1) * pageSize;

        for (uint256 i = 0; i < pageSize; i++) {
            if (pixels.length > pixelIndex) {
                result[i] = pixels[pixelIndex];
                pixelIndex++;
            } else {
                return result;
            }
        }

        return result;
    }

    function pixelsCount() public view virtual returns (uint256) {
        return pixels.length;
    }

    function withdraw(uint256 funds) external onlyOwner {
        payable(owner()).transfer(funds);
    }

    receive() external payable {}
}
