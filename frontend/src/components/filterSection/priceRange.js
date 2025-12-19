import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { setPriceRange } from "../../features/filterBySlice";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

export const PriceRange = ({ setCheckedPriceRangeDOM }) => {
  const [isPriceSectionOpen, setIsPriceSectionOpen] = useState(true);
  const dispatch = useDispatch();

  // Price range configuration
  const MIN_PRICE = 2000;
  const MAX_PRICE = 50000;
  const STEP = 500;

  // Local state for slider values
  const [minValue, setMinValue] = useState(MIN_PRICE);
  const [maxValue, setMaxValue] = useState(MAX_PRICE);

  // Get current price range from Redux
  const { priceRange } = useSelector((state) => state.filterByCategoryAndPrice);

  // Update local state when Redux state changes (e.g., on reset)
  useEffect(() => {
    if (!priceRange) {
      setMinValue(MIN_PRICE);
      setMaxValue(MAX_PRICE);
    }
  }, [priceRange]);

  // Handle min slider change
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - STEP);
    setMinValue(value);
    updatePriceRange(value, maxValue);
  };

  // Handle max slider change
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + STEP);
    setMaxValue(value);
    updatePriceRange(minValue, value);
  };

  // Handle min input change
  const handleMinInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= MIN_PRICE && value < maxValue) {
      setMinValue(value);
      updatePriceRange(value, maxValue);
    }
  };

  // Handle max input change
  const handleMaxInputChange = (e) => {
    const value = Number(e.target.value);
    if (value <= MAX_PRICE && value > minValue) {
      setMaxValue(value);
      updatePriceRange(minValue, value);
    }
  };

  // Update Redux state with price range
  const updatePriceRange = (min, max) => {
    // Only dispatch if not at default values
    if (min === MIN_PRICE && max === MAX_PRICE) {
      dispatch(setPriceRange(null));
      setCheckedPriceRangeDOM(null);
    } else {
      // Format as "min-max" to maintain compatibility with existing filter logic
      const rangeString = max === MAX_PRICE ? `${min}-` : `${min}-${max}`;
      dispatch(setPriceRange(rangeString));
    }
  };

  // Calculate percentage for slider track styling
  const getPercentage = (value) => {
    return ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <article className="flex flex-col gap-4 w-full mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg tablet:text-xl font-bold font-inter">Price Range</h3>
        {isPriceSectionOpen ? (
          <RiArrowDropUpLine
            className="w-8 h-6 cursor-pointer"
            onClick={() => setIsPriceSectionOpen(!isPriceSectionOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-8 h-6 cursor-pointer"
            onClick={() => setIsPriceSectionOpen(!isPriceSectionOpen)}
          />
        )}
      </div>

      <AnimatePresence>
        {isPriceSectionOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            className="flex flex-col gap-6 overflow-hidden"
          >
            {/* Price Display */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1 max-w-[120px]">
                <label className="text-xs text-sage-600 mb-1 block font-inter">Min</label>
                <input
                  type="number"
                  value={minValue}
                  onChange={handleMinInputChange}
                  min={MIN_PRICE}
                  max={maxValue - STEP}
                  step={STEP}
                  className="w-full px-2 py-1.5 border border-sage-300 rounded-md text-sm font-inter font-medium outline-none focus:border-sage-600 transition-colors"
                />
              </div>
              <div className="h-10 w-px bg-sage-300 mt-5"></div>
              <div className="flex-1 max-w-[120px]">
                <label className="text-xs text-sage-600 mb-1 block font-inter">Max</label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={handleMaxInputChange}
                  min={minValue + STEP}
                  max={MAX_PRICE}
                  step={STEP}
                  className="w-full px-2 py-1.5 border border-sage-300 rounded-md text-sm font-inter font-medium outline-none focus:border-sage-600 transition-colors"
                />
              </div>
            </div>

            {/* Dual Range Slider */}
            <div className="relative pt-2 pb-4">
              {/* Track Background */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-sage-100 rounded-full" />

              {/* Active Track */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 bg-sage-600 rounded-full"
                style={{
                  left: `${getPercentage(minValue)}%`,
                  right: `${100 - getPercentage(maxValue)}%`,
                }}
              />

              {/* Min Slider */}
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                value={minValue}
                onChange={handleMinChange}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-sage-800 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sage-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-sage-800 [&::-moz-range-thumb]:transition-colors"
                style={{ zIndex: minValue > MAX_PRICE - (MAX_PRICE - MIN_PRICE) / 4 ? 5 : 3 }}
              />

              {/* Max Slider */}
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                value={maxValue}
                onChange={handleMaxChange}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-sage-800 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sage-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-sage-800 [&::-moz-range-thumb]:transition-colors"
                style={{ zIndex: 4 }}
              />
            </div>

            {/* Price Labels */}
            <div className="flex items-center justify-between text-xs text-sage-600 font-inter font-medium">
              <span>{formatCurrency(MIN_PRICE)}</span>
              <span>{formatCurrency(MAX_PRICE)}</span>
            </div>

            {/* Current Selection Display */}
            <div className="bg-sage-50 rounded-lg p-3 text-center">
              <p className="text-sm text-sage-700 font-inter">
                Selected Range: <span className="font-semibold text-sage-900">{formatCurrency(minValue)} - {formatCurrency(maxValue)}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
