import React, {useRef, useState, useEffect} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';

// Simple, dependency-free slider component for React Native (TypeScript)
// - paging-enabled horizontal ScrollView
// - prev / next buttons
// - pagination dots
// - responsive to screen width
//
// Usage: import Slider from './ReactNativeSlider';
// <Slider slides={[<View>...</View>, ...]} initialIndex={0} />

type SliderProps = {
  slides: React.ReactNode[]; // array of React elements to show as pages
  initialIndex?: number; // starting page index
  showButtons?: boolean; // show prev/next buttons
  showDots?: boolean; // show pagination dots
  containerStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  activeDotStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  onIndexChange?: (index: number) => void;
};

const Slider: React.FC<SliderProps> = ({
  slides,
  initialIndex = 0,
  showButtons = true,
  showDots = true,
  containerStyle,
  dotStyle,
  activeDotStyle,
  buttonStyle,
  buttonTextStyle,
  onIndexChange,
}) => {
  const {width} = useWindowDimensions();
  const scrollRef = useRef<ScrollView | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (initialIndex < 0) return 0;
    if (initialIndex >= slides.length) return slides.length - 1;
    return initialIndex;
  });

  // Animated value to drive any animations (not strictly necessary here but useful)
  const scrollX = useRef(new Animated.Value(initialIndex * width)).current;

  useEffect(() => {
    // scroll to initial index when mounted or when width changes (orientation)
    scrollTo(currentIndex, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const scrollTo = (index: number, animated = true) => {
    if (!scrollRef.current) return;
    const x = Math.round(index * width);
    scrollRef.current.scrollTo({x, y: 0, animated});
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const goPrev = () => {
    const next = Math.max(0, currentIndex - 1);
    setCurrentIndex(next);
    scrollTo(next);
  };

  const goNext = () => {
    const next = Math.min(slides.length - 1, currentIndex + 1);
    setCurrentIndex(next);
    scrollTo(next);
  };

  // Keep Animated value updated during scroll (optional, enables animated dots etc.)
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        ref={r => (scrollRef.current = r)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{alignItems: 'stretch'}}
        keyboardShouldPersistTaps="handled">
        {slides.map((child, idx) => (
          <View key={idx} style={[styles.page, {width}]}>
            {child}
          </View>
        ))}
      </ScrollView>

      {showButtons && (
        <View style={styles.buttonsContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.button,
              buttonStyle,
              currentIndex === 0 && styles.buttonDisabled,
            ]}
            onPress={goPrev}
            disabled={currentIndex === 0}
            accessibilityLabel="Previous Slide">
            <Text style={[styles.buttonText, buttonTextStyle]}>{'‹'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              buttonStyle,
              currentIndex === slides.length - 1 && styles.buttonDisabled,
            ]}
            onPress={goNext}
            disabled={currentIndex === slides.length - 1}
            accessibilityLabel="Next Slide">
            <Text style={[styles.buttonText, buttonTextStyle]}>{'›'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showDots && (
        <View style={styles.dotsContainer} pointerEvents="box-none">
          {slides.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setCurrentIndex(i);
                  scrollTo(i);
                }}
                style={[
                  styles.dot,
                  dotStyle,
                  isActive ? [styles.activeDot, activeDotStyle] : undefined,
                ]}
                accessibilityLabel={`Go to slide ${i + 1}`}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  page: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 26,
    lineHeight: 28,
    textAlign: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 14,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
});

export default Slider;
