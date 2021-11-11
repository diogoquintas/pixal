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
 *  The painting size is 1000x1000 pixels.
 *  The first time a pixel is painted is free but to re-paint a pixel
 *  it is required to pay the respective `price`.
 */
contract Painting is ReentrancyGuard {
    address private owner;
    uint256 constant basePrice = 0.00001 ether;

    Details[] pixels;

    /// Mapping between a pixel coordinate and its corresponding position inside the pixel list.
    /// Usefull to check if a pixel is painted.
    mapping(bytes => uint256) positions;

    event PixelPainted(uint16 x, uint16 y);

    constructor() {
        owner = msg.sender;
    }

    function id(uint16 x, uint16 y)
        internal
        view
        virtual
        returns (bytes memory)
    {
        return abi.encodePacked(x, y);
    }

    function price(uint256 timesPainted) internal pure returns (uint256) {
        if (timesPainted >= 11) {
            return 1000000 ether;
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
        require(x < 1000 && y < 1000, "Coordinates out of range");

        bytes memory pixelId = id(x, y);
        uint256 position = positions[pixelId];

        if (position > 0) {
            uint256 index = position - 1;
            uint256 expense = price(pixels[index].timesPainted);
            address previousAuthor = pixels[index].author;

            require(
                funds >= expense && funds - expense >= 0,
                "Not enough funds"
            );

            pixels[index].timesPainted++;
            pixels[index].color = color;
            pixels[index].author = msg.sender;

            payable(previousAuthor).transfer((expense * 3) / 4);

            return expense;
        } else {
            pixels.push(Details(x, y, 1, color, msg.sender));
            positions[pixelId] = pixels.length;

            return 0;
        }
    }

    /**
     * @dev The painting function.
     *
     * It goes through the '_pixels' array and tries to paint them with the received value.
     * Reverts if there's not enough funds to cover the expense.
     */
    function paint(Pixel[] memory _pixels) public payable nonReentrant {
        uint256 funds = msg.value;

        for (uint256 i = 0; i < _pixels.length; i++) {
            uint256 expense = paintPixel(
                _pixels[i].x,
                _pixels[i].y,
                _pixels[i].color,
                funds
            );

            funds -= expense;

            emit PixelPainted(_pixels[i].x, _pixels[i].y);
        }
    }

    /**
     * @dev The listing function, it returns a paginated list of pixels.
     *
     * The full list of pixels can contain large amounts of data.
     * As a workaround, the function accepts a 'pageSize' argument to limit the data output.
     */
    function list(uint256 page, uint256 pageSize)
        public
        view
        virtual
        returns (Details[] memory)
    {
        require(page > 0, "Page must be higher than 0");

        Details[] memory result = new Details[](pageSize);
        uint256 index = (page - 1) * pageSize;

        for (uint256 i = 0; i < pageSize; i++) {
            if (pixels.length > index) {
                result[i] = pixels[index];
                index++;
            } else {
                return result;
            }
        }

        return result;
    }

    function pixel(uint16 x, uint16 y)
        public
        view
        virtual
        returns (Details memory)
    {
        return pixels[positions[id(x, y)] - 1];
    }

    function length() public view virtual returns (uint256) {
        return pixels.length;
    }

    function withdraw(uint256 funds) external {
        require(msg.sender == owner);

        payable(owner).transfer(funds);
    }

    receive() external payable {}
}
