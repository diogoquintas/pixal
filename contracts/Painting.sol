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

    event PixelPainted(PixelInfo _paintedPixel);

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

    function amountToReceive(uint256 _pixelPrice)
        internal
        pure
        returns (uint256)
    {
        return (_pixelPrice * 3) / 4;
    }

    function paint(
        Coordinates memory _coordinates,
        string memory _color,
        uint256 _funds
    ) internal returns (uint256) {
        require(
            _coordinates.x < axisSize && _coordinates.y < axisSize,
            "Coordinates out of range"
        );

        uint256 _pixelPosition = pixelPosition(_coordinates);

        if (_pixelPosition > 0) {
            uint256 _pixelIndex = _pixelPosition - 1;
            address payable _receiver = pixels[_pixelIndex].owner;
            uint256 _pixelPrice = pixelPrice(pixels[_pixelIndex].paintCount);

            require(
                _funds >= _pixelPrice && _funds - _pixelPrice >= 0,
                "Not enough funds"
            );

            pixels[_pixelIndex].color = _color;
            pixels[_pixelIndex].owner = payable(msg.sender);
            pixels[_pixelIndex].paintCount += 1;

            _receiver.transfer(amountToReceive(_pixelPrice));

            emit PixelPainted(pixels[_pixelIndex]);

            return _pixelPrice;
        } else {
            pixelPositionById[pixelId(_coordinates)] = pixels.length + 1;
            pixels.push(
                PixelInfo(_color, 1, _coordinates, payable(msg.sender))
            );

            emit PixelPainted(pixels[pixels.length - 1]);

            return 0;
        }
    }

    function paintPixels(Pixel[] memory _pixels) public payable nonReentrant {
        uint256 funds = msg.value;

        for (uint256 _i = 0; _i < _pixels.length; _i++) {
            uint256 _pixelPrice = paint(
                _pixels[_i].coordinates,
                _pixels[_i].color,
                funds
            );

            funds -= _pixelPrice;
        }
    }

    function pixelsPrice(Pixel[] memory _pixels)
        public
        view
        virtual
        returns (uint256)
    {
        uint256 _price = 0;

        for (uint256 _i = 0; _i < _pixels.length; _i++) {
            uint256 _pixelPosition = pixelPosition(_pixels[_i].coordinates);

            if (_pixelPosition > 0) {
                PixelInfo memory _pixel = pixels[_pixelPosition + 1];

                _price += pixelPrice(_pixel.paintCount);
            }
        }

        return _price;
    }

    function pixelsInfo(uint256 _page, uint256 _pageSize)
        public
        view
        virtual
        returns (PixelInfo[] memory)
    {
        require(_page > 0, "Page must be higher than 0");

        PixelInfo[] memory _pixels = new PixelInfo[](_pageSize);
        uint256 _pixelIndex = (_page - 1) * _pageSize;

        for (uint256 _pointer = 0; _pointer < _pageSize; _pointer++) {
            if (pixels.length > _pixelIndex) {
                _pixels[_pointer] = pixels[_pixelIndex];
                _pixelIndex++;
            } else {
                return _pixels;
            }
        }

        return _pixels;
    }

    function pixelsCount() public view virtual returns (uint256) {
        return pixels.length;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
