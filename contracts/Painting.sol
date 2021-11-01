// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct PixelInfo {
    uint16 x;
    uint16 y;
    bytes3 color;
    uint256 count;
    address payable owner;
}

struct Pixel {
    uint16 x;
    uint16 y;
    bytes3 color;
}

contract Painting is ReentrancyGuard, Ownable {
    uint8 constant pricePowerCap = 11;
    uint16 constant boundary = 1000;
    uint256 constant referencePrice = 0.00001 ether;

    PixelInfo[] pixels;

    mapping(bytes => uint256) pixelPositionById;

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

        return pixelPositionById[id];
    }

    function pixelInfo(uint16 x, uint16 y)
        public
        view
        virtual
        returns (PixelInfo memory)
    {
        uint256 position = pixelPosition(x, y);

        require(position > 0, "Pixel does not exist");

        return pixels[position - 1];
    }

    function pixelPrice(uint256 count) internal pure returns (uint256) {
        if (count >= pricePowerCap) {
            return referencePrice * 10**pricePowerCap;
        }

        return referencePrice * 10**count;
    }

    function ownerShare(uint256 price) internal pure returns (uint256) {
        return (price * 3) / 4;
    }

    function paint(
        uint16 x,
        uint16 y,
        bytes3 color,
        uint256 funds
    ) internal returns (uint256) {
        require(x < boundary && y < boundary, "Coordinates out of range");

        uint256 position = pixelPosition(x, y);

        if (position > 0) {
            uint256 index = position - 1;
            uint256 price = pixelPrice(pixels[index].count);
            address payable previousOwner = pixels[index].owner;

            require(funds >= price && funds - price >= 0, "Not enough funds");

            pixels[index].color = color;
            pixels[index].owner = payable(msg.sender);
            pixels[index].count += 1;

            previousOwner.transfer(ownerShare(price));

            emit PixelPainted(x, y);

            return price;
        } else {
            pixelPositionById[pixelId(x, y)] = pixels.length + 1;
            pixels.push(PixelInfo(x, y, color, 1, payable(msg.sender)));

            emit PixelPainted(x, y);

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
                pixelsToPaint[i].x,
                pixelsToPaint[i].y,
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
