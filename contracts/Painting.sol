// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

struct Coordinate {
    uint256 x;
    uint256 y;
}

struct Pixel {
    string color;
    address payable owner;
    uint256 value;
    Coordinate coordinate;
}

struct PixelToPaint {
    string color;
    uint256 offer;
    Coordinate coordinate;
}

contract Painting {
    uint256 constant _axisMaxSize = 1000;
    uint256 constant _baseValue = 1 wei;
    address public owner;

    Pixel[] _pixels;

    mapping(bytes => uint256) _pixelPosition;

    constructor() {
        owner = msg.sender;
    }

    function _getPixelId(Coordinate memory coordinate)
        internal
        view
        virtual
        returns (bytes memory)
    {
        return abi.encodePacked(coordinate.x, coordinate.y);
    }

    function _getPixel(Coordinate memory coordinate)
        public
        view
        virtual
        returns (Pixel memory)
    {
        bytes memory pixelId = _getPixelId(coordinate);
        uint256 pixelPosition = _pixelPosition[pixelId];

        require(pixelPosition > 0, "Pixel does not exist");

        return _pixels[pixelPosition - 1];
    }

    function _paint(
        Coordinate memory coordinate,
        string memory color,
        uint256 offer
    ) internal {
        require(
            coordinate.x < _axisMaxSize && coordinate.y < _axisMaxSize,
            "Coordinates out of range"
        );

        bytes memory pixelId = _getPixelId(coordinate);
        uint256 pixelPosition = _pixelPosition[pixelId];

        if (pixelPosition > 0) {
            uint256 pixelIndex = pixelPosition - 1;
            address receiver = _pixels[pixelIndex].owner;

            _pixels[pixelIndex].color = color;
            _pixels[pixelIndex].owner = payable(msg.sender);
            _pixels[pixelIndex].value = offer + _baseValue;

            payable(receiver).transfer(offer);
        } else {
            Pixel memory pixelToAdd = Pixel(
                color,
                payable(msg.sender),
                offer + _baseValue,
                coordinate
            );

            _pixelPosition[pixelId] = _pixels.length + 1;
            _pixels.push(pixelToAdd);
        }
    }

    function _paintPixels(PixelToPaint[] memory pixels) public payable {
        require(_canAfford(pixels, msg.value), "Not enought funds");

        for (uint256 i = 0; i < pixels.length; i++) {
            _paint(pixels[i].coordinate, pixels[i].color, pixels[i].offer);
        }
    }

    function _canAfford(PixelToPaint[] memory pixels, uint256 offer)
        public
        view
        virtual
        returns (bool)
    {
        uint256 totalOffer = 0;

        for (uint256 i = 0; i < pixels.length; i++) {
            totalOffer += pixels[i].offer;
        }

        return offer >= totalOffer;
    }

    function _getPixels() public view virtual returns (Pixel[] memory) {
        return _pixels;
    }

    function _withdrawal() public {
        require(msg.sender == owner);
        payable(msg.sender).transfer(address(this).balance);
    }
}
