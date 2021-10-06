// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Coordinates {
    uint256 x;
    uint256 y;
}

struct PixelInfo {
    string color;
    uint256 paintCount;
    Coordinates coordinates;
    address payable owner;
}

struct Pixel {
    string color;
    Coordinates coordinates;
}

contract Painting is ReentrancyGuard, Ownable {
    // The size of the image is axisSize X axisSize
    uint16 constant axisSize = 1000;
    uint256 constant referencePrice = 0.00001 ether;
    uint8 constant pricePowerCap = 11;

    PixelInfo[] pixels;

    // Map the pixelId (x and y) to the corresponding position in the pixels array
    mapping(bytes => uint256) pixelPositionById;

    function pixelId(Coordinates memory _coordinates)
        internal
        view
        virtual
        returns (bytes memory)
    {
        return abi.encodePacked(_coordinates.x, _coordinates.y);
    }

    function pixelPosition(Coordinates memory _coordinates)
        public
        view
        virtual
        returns (uint256)
    {
        bytes memory _pixelId = pixelId(_coordinates);

        return pixelPositionById[_pixelId];
    }

    function pixelInfo(Coordinates memory _coordinates)
        public
        view
        virtual
        returns (PixelInfo memory)
    {
        uint256 _pixelPosition = pixelPosition(_coordinates);

        require(_pixelPosition > 0, "Pixel does not exist");

        return pixels[_pixelPosition - 1];
    }

    function pixelPrice(uint256 _paintCount)
        public
        view
        virtual
        returns (uint256)
    {
        if (_paintCount >= pricePowerCap) {
            return referencePrice * 10**pricePowerCap;
        }

        return referencePrice * 10**_paintCount;
    }

    function transferableAmount(uint256 _paintCount)
        internal
        view
        returns (uint256)
    {
        return (pixelPrice(_paintCount) * 3) / 4;
    }

    function paint(Coordinates memory _coordinates, string memory _color)
        internal
    {
        require(
            _coordinates.x < axisSize && _coordinates.y < axisSize,
            "Coordinates out of range"
        );

        uint256 _pixelPosition = pixelPosition(_coordinates);

        if (_pixelPosition > 0) {
            uint256 _pixelIndex = _pixelPosition - 1;
            address payable _receiver = pixels[_pixelIndex].owner;

            pixels[_pixelIndex].color = _color;
            pixels[_pixelIndex].owner = payable(msg.sender);
            pixels[_pixelIndex].paintCount += 1;

            _receiver.transfer(
                transferableAmount(pixels[_pixelIndex].paintCount - 1)
            );
        } else {
            PixelInfo memory pixelToAdd = PixelInfo(
                _color,
                1,
                _coordinates,
                payable(msg.sender)
            );

            pixelPositionById[pixelId(_coordinates)] = pixels.length + 1;
            pixels.push(pixelToAdd);
        }
    }

    function paintPixels(Pixel[] memory _pixels) public payable nonReentrant {
        require(canAfford(_pixels, msg.value), "Not enought funds");

        for (uint256 _i = 0; _i < _pixels.length; _i++) {
            paint(_pixels[_i].coordinates, _pixels[_i].color);
        }
    }

    function canAfford(Pixel[] memory _pixels, uint256 _amount)
        public
        view
        virtual
        returns (bool)
    {
        uint256 _price = 0;

        for (uint256 _i = 0; _i < _pixels.length; _i++) {
            uint256 _pixelPosition = pixelPosition(_pixels[_i].coordinates);

            if (_pixelPosition > 0) {
                PixelInfo memory _pixel = pixels[_pixelPosition + 1];

                _price += pixelPrice(_pixel.paintCount);
            }
        }

        return _amount >= _price;
    }

    function pixelsInfo() public view virtual {
        return pixels;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
