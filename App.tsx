import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Image} from 'react-native';
import Slider from '@react-native-community/slider';
import ReelDial from './components/ReelDial';

const App: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1.5);
  const [weight, setWeight] = useState<number>(3);
  const [targetDepth, setTargetDepth] = useState<number>(20);
  const [lineLength, setLineLength] = useState<string>('');
  const [feet, setFeet] = useState<boolean>(true);

  const sliders = [
    {
      label: 'Speed',
      unit: 'mph',
      min: 1,
      max: 2,
      step: 0.1,
      value: speed,
      setValue: setSpeed,
    },
    {
      label: 'Weight',
      unit: 'oz',
      min: 1,
      max: 5,
      step: 0.5,
      value: weight,
      setValue: setWeight,
    },
  ];

  const table12: number[][] = [
    [2, 2, 4, 6, 7, 13, 15, 16, 18, 20, 22, 24, 25, 23, 24],
    [4, 5.5, 8.5, 10, 11, 16, 19, 20, 22, 23.5, 25.5, 28, 29, 27.5, 29],
    [6, 9, 13, 14, 15, 19, 23, 24, 26, 27, 29, 32, 33, 32, 34],
    [7, 10, 15, 16, 18, 21.5, 26, 27, 29.5, 31, 32.5, 35.5, 37.5, 37.5, 39],
    [8, 11, 17, 18, 21, 24, 29, 30, 33, 35, 36, 39, 42, 43, 44],
    [9, 12, 17, 18.5, 22.5, 26, 31, 33, 35, 38, 40, 42, 46, 47, 48.5],
    [10, 13, 17, 19, 24, 28, 33, 36, 37, 41, 44, 45, 50, 51, 53],
    [
      10, 16.5, 22.5, 23.5, 29.5, 35, 39, 42.5, 44.5, 49, 52.5, 55, 58.5, 62,
      63,
    ],
    [10, 20, 28, 28, 35, 42, 45, 49, 52, 57, 61, 65, 67, 73, 73],
  ];

  const table15: number[][] = [
    [1, 4, 8, 8, 9, 11, 12, 13, 16, 18, 20, 17, 15, 21, 23],
    [2, 6, 8.5, 9.5, 11, 14, 16, 17, 20, 22.5, 23.5, 22.5, 20.5, 25.5, 27.5],
    [3, 8, 9, 11, 13, 17, 20, 21, 24, 27, 27, 28, 26, 30, 32],
    [3, 8, 10.5, 14, 15.5, 19.5, 21.5, 24, 26, 30, 30.5, 30, 29.5, 34, 35],
    [3, 8, 12, 17, 18, 22, 23, 27, 28, 33, 34, 32, 33, 38, 38],
    [3.5, 9, 13.5, 19, 20.5, 25, 26, 30, 31, 36.5, 37.5, 38, 37.5, 42, 41.5],
    [4, 10, 15, 21, 23, 28, 29, 33, 34, 40, 41, 44, 42, 46, 45],
    [
      4.5, 11.5, 16, 21.5, 23, 29, 30, 36, 37.5, 43.5, 45.5, 47.5, 44.5, 48.5,
      47.5,
    ],
    [5, 13, 17, 22, 23, 30, 31, 39, 41, 47, 50, 51, 47, 51, 50],
  ];

  const lineLengths: number[] = [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
  ];

  function interpolateSpeed(speed: number): number[][] {
    return table12.map((row, i) =>
      row.map((value12, j) => {
        const value15 = table15[i][j];
        const interval = Math.abs(value12 - value15) / 3;
        const interpolatedValue =
          speed < 1.2
            ? value12 +
              (speed - 1.2) * 10 * interval * Math.sign(value15 - value12)
            : speed > 1.5
            ? value15 +
              (speed - 1.5) * 10 * interval * Math.sign(value12 - value15)
            : value12 + ((speed - 1.2) / 0.3) * (value15 - value12);
        return Math.max(0, interpolatedValue);
      }),
    );
  }

  function customRound(num: number): number {
    const roundedNum = Math.round(num * 100) / 100;
    return Number.isInteger(roundedNum) ||
      /^0+$/.test(roundedNum.toString().split('.')[1])
      ? parseInt(roundedNum.toString(), 10)
      : roundedNum;
  }

  function interpolateLineLength(
    depths: number[],
    targetDepth: number,
  ): number | string {
    if (targetDepth < depths[0]) return 'Take some weight off amigo!';
    for (let i = 0; i < depths.length; i++) {
      if (depths[i] > targetDepth) {
        return i === 0
          ? 10 * (targetDepth / depths[0])
          : customRound(
              lineLengths[i - 1] +
                10 *
                  ((targetDepth - depths[i - 1]) / (depths[i] - depths[i - 1])),
            );
      }
    }
    return "You're gonna need to add some weight boss";
  }

  function interpolationManager(
    speed: number,
    weight: number,
    targetDepth: number,
  ): number | string {
    const table =
      speed === 1.2
        ? table12
        : speed === 1.5
        ? table15
        : interpolateSpeed(speed);
    const weightIndex = Math.round((weight - 1) / 0.5);
    const depths = table[weightIndex];
    return interpolateLineLength(depths, targetDepth);
  }

  useEffect(() => {
    const result = interpolationManager(speed, weight, targetDepth);
    setLineLength(String(result));
  }, [speed, weight, targetDepth]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerContainer}>
        <Image source={require('./assets/mike.png')} style={styles.image} />
        <View style={styles.titlesContainer}>
          <Text style={styles.title}>Little Mike's</Text>
          <Text style={styles.title}>Trolling</Text>
          <Text style={styles.title}>Calculator</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        {sliders.map((slider, index) => (
          <View key={index} style={styles.sliderContainer}>
            <Text style={styles.subtitle}>
              {slider.label}:{' '}
              <Text style={styles.boldText}>
                {slider.value.toFixed(1)} {slider.unit}
              </Text>
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={slider.min}
              maximumValue={slider.max}
              step={slider.step}
              value={slider.value}
              onValueChange={slider.setValue}
            />
          </View>
        ))}
        <Text style={styles.subtitle}>
          Target Depth: <Text style={styles.boldText}>{targetDepth} ft</Text>
        </Text>
        <ReelDial
          min={0}
          max={100}
          step={1}
          onValueChange={(value: number) => setTargetDepth(value)}
        />
      </View>

      <View style={styles.outputContainer}>
        <View style={styles.output}>
          <Text style={styles.outputText}>
            {feet && 'Let out '}
            {lineLength} {feet && 'feet of line'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%',
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '55%',
  },
  image: {
    width: 112,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 20, // Add some space below the image
  },
  output: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#B0C4DE', // Light theme color for the output container
    borderWidth: 1,
    borderColor: '#708090', // Border color that matches the theme
  },
  outputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '15%',
  },
  outputText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000', // Dark color for text
  },
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F0F8FF', // Soft background color
  },
  sliderContainer: {
    width: '90%',
    marginBottom: '3%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#2F4F4F', // Darker color for better readability
    marginBottom: 10, // Space between text and slider
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2F4F4F', // Theme color for titles
    textAlign: 'center', // Center-align titles
    marginBottom: 10, // Space below the title
  },
  titlesContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 200,
  },
});

export default App;
