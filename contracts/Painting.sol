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

    function _paint(Coordinate memory coordinate, string memory color)
        public
        payable
    {
        require(
            coordinate.x < _axisMaxSize && coordinate.y < _axisMaxSize,
            "Coordinates out of range"
        );

        bytes memory pixelId = _getPixelId(coordinate);
        uint256 pixelPosition = _pixelPosition[pixelId];

        if (pixelPosition > 0) {
            uint256 pixelIndex = pixelPosition - 1;

            require(
                msg.value > _pixels[pixelIndex].value,
                "Not enough funds to paint pixel"
            );

            address receiver = _pixels[pixelIndex].owner;

            _pixels[pixelIndex].color = color;
            _pixels[pixelIndex].owner = payable(msg.sender);
            _pixels[pixelIndex].value = msg.value + _baseValue;

            payable(receiver).transfer(msg.value);
        } else {
            require(msg.value > _baseValue, "Not enough funds to paint pixel");

            Pixel memory pixelToAdd = Pixel(
                color,
                payable(msg.sender),
                msg.value + _baseValue,
                coordinate
            );

            _pixelPosition[pixelId] = _pixels.length + 1;
            _pixels.push(pixelToAdd);
        }
    }

    function _getPixels() public view virtual returns (Pixel[] memory) {
        return _pixels;
    }

    function _withdrawal() public {
        require(msg.sender == owner);
        payable(msg.sender).transfer(address(this).balance);
    }
}
