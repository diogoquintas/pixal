// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Coordinates {
    uint16 x;
    uint16 y;
}

struct PixelInfo {
    string color;
    uint256 count;
    Coordinates coordinates;
    address payable owner;
}

struct Pixel {
    string color;
    Coordinates coordinates;
}

contract Painting is ReentrancyGuard, Ownable {
    uint8 constant pricePowerCap = 11;
    uint16 constant boundary = 1000;
    uint256 constant referencePrice = 0.00001 ether;

    PixelInfo[] pixels;

    // Map the pixelId (x and y) to the corresponding position in the pixels array
    mapping(bytes => uint256) pixelPositionById;

    event PixelPainted(PixelInfo _paintedPixel);

    function pixelId(Coordinates memory coordinates)
        internal
        view
        virtual
        returns (bytes memory)
    {
        return abi.encodePacked(coordinates.x, coordinates.y);
    }

    function pixelPosition(Coordinates memory coordinates)
        public
        view
        virtual
        returns (uint256)
    {
        bytes memory id = pixelId(coordinates);

        return pixelPositionById[id];
    }

    function pixelInfo(Coordinates memory coordinates)
        public
        view
        virtual
        returns (PixelInfo memory)
    {
        uint256 position = pixelPosition(coordinates);

        require(position > 0, "Pixel does not exist");

        return pixels[position - 1];
    }

    function pixelPrice(uint256 count) public view virtual returns (uint256) {
        if (count >= pricePowerCap) {
            return referencePrice * 10**pricePowerCap;
        }

        return referencePrice * 10**count;
    }

    function ownerShare(uint256 price) public view virtual returns (uint256) {
        return (price * 3) / 4;
    }

    function paint(
        Coordinates memory coordinates,
        string memory color,
        uint256 funds
    ) internal returns (uint256) {
        require(
            coordinates.x < boundary && coordinates.y < boundary,
            "Coordinates out of range"
        );

        uint256 position = pixelPosition(coordinates);

        if (position > 0) {
            uint256 index = position - 1;
            uint256 price = pixelPrice(pixels[index].count);
            address payable previousOwner = pixels[index].owner;

            require(funds >= price && funds - price >= 0, "Not enough funds");

            pixels[index].color = color;
            pixels[index].owner = payable(msg.sender);
            pixels[index].count += 1;

            previousOwner.transfer(ownerShare(price));

            emit PixelPainted(pixels[index]);

            return price;
        } else {
            pixelPositionById[pixelId(coordinates)] = pixels.length + 1;
            pixels.push(PixelInfo(color, 1, coordinates, payable(msg.sender)));

            emit PixelPainted(pixels[pixels.length - 1]);

            return 0;
        }
    }

    function paintPixels(Pixel[] memory pixelsToPaint)
        public
        payable
        nonReentrant
    {
        uint256 funds = msg.value;

        for (uint256 i = 0; i < pixelsToPaint.length; i++) {
            uint256 expendedFunds = paint(
                pixelsToPaint[i].coordinates,
                pixelsToPaint[i].color,
                funds
            );

            funds -= expendedFunds;
        }
    }

    function pixelsInfo(uint256 page, uint256 pageSize)
        public
        view
        virtual
        returns (PixelInfo[] memory)
    {
        require(page > 0, "Page must be higher than 0");

        PixelInfo[] memory result = new PixelInfo[](pageSize);
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

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
