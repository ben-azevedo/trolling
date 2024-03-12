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

  const table12 = [
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

  const table15 = [
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

  function interpolateSpeed(speed: number) {
    const table = [];

    for (let i = 0; i < table12.length; i++) {
      const row = [];
      for (let j = 0; j < table12[i].length; j++) {
        const value12 = table12[i][j];
        const value15 = table15[i][j];
        const interval = Math.abs(value12 - value15) / 3;
        let interpolatedValue;

        if (speed < 1.2) {
          interpolatedValue =
            value12 +
            (speed - 1.2) * 10 * interval * (value12 > value15 ? -1 : 1);
        } else if (speed > 1.5) {
          interpolatedValue =
            value15 +
            (speed - 1.5) * 10 * interval * (value15 < value12 ? 1 : -1);
        } else {
          // 1.2 <= speed <= 1.5
          interpolatedValue =
            value12 + ((speed - 1.2) / 0.3) * (value15 - value12);
        }

        row.push(Math.max(0, interpolatedValue)); // Ensure non-negative values
      }
      table.push(row);
    }

    return table;
  }

  function customRound(num: number) {
    // First, round the number to the desired precision
    const roundedNum = Math.round(num * 100) / 100;

    // Check if the rounded number is an integer
    if (Number.isInteger(roundedNum)) {
      // If it's an integer, return it as is
      return roundedNum;
    } else {
      // If it's not an integer, ensure it retains the necessary decimal places
      // Convert to string to check for trailing zeros
      const strNum = roundedNum.toString();

      // If there's a decimal point, and the only digit(s) after it are '0', parse as integer
      if (strNum.includes('.') && /^0+$/.test(strNum.split('.')[1])) {
        return parseInt(strNum, 10);
      }

      // Otherwise, return the number with its significant decimal digits
      return roundedNum;
    }
  }

  function interpolateLineLength(depths: number[], targetDepth: number) {
    const lineLengths = [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
    ];
    setFeet(false);
    if (targetDepth < depths[0]) return 'Take some weight off amigo!';
    for (let i = 0; i < depths.length; i++) {
      if (depths[i] > targetDepth) {
        if (i === 0) {
          return 10 * (targetDepth / depths[0]);
        } else {
          let max = depths[i] - depths[i - 1];
          let range = targetDepth - depths[i - 1];
          setFeet(true);
          let rounded = customRound(lineLengths[i - 1] + 10 * (range / max));
          return rounded;
        }
      }
    }
    return "You're gonna need to add some weight boss";
  }

  function interpolationManager(
    speed: number,
    weight: number,
    targetDepth: number,
  ) {
    let table;
    if (speed === 1.2) {
      table = table12;
    } else if (speed === 1.5) {
      table = table15;
    } else {
      table = interpolateSpeed(speed);
    }

    // pick correct row for weight
    const weightIndex = (weight - 1) / 0.5;
    const depths = table[weightIndex];

    // interpolate linelength value for targetDepth
    const lineLength = interpolateLineLength(depths, targetDepth);
    return lineLength;
  }

  useEffect(() => {
    const result = interpolationManager(speed, weight, targetDepth);
    setLineLength(String(result));
  }, [speed, weight, targetDepth]); // This effect depends on speed, weight, and targetDepth

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F0F8FF'}}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Image source={require('./assets/mike.png')} style={styles.image} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              height: 200,
            }}>
            <Text style={styles.title}>Little Mike's</Text>
            <Text style={styles.title}>Trolling</Text>
            <Text style={styles.title}>Calculator</Text>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.subtitle}>Speed: {speed.toFixed(1)} mph</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={2}
            step={0.1}
            value={speed}
            onValueChange={value => setSpeed(value)}
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.subtitle}>Weight: {weight.toFixed(1)} oz</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={0.5}
            value={weight}
            onValueChange={value => setWeight(value)}
          />
        </View>

        <Text style={styles.subtitle}>Target Depth: {targetDepth} ft</Text>
        <ReelDial
          min={0}
          max={100}
          step={1}
          onValueChange={(value: number) => setTargetDepth(value)}
        />
        <View style={styles.outputContainer}>
          <Text style={styles.output}>
            {feet && 'Let out '}
            {lineLength} {feet && 'feet of line'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF', // Soft background color
  },
  image: {
    width: 140,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20, // Add some space below the image
  },
  sliderContainer: {
    width: '90%',
    marginBottom: 30,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F4F4F', // Theme color for titles
    textAlign: 'center', // Center-align titles
    marginBottom: 10, // Space below the title
  },
  outputContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#B0C4DE', // Light theme color for the output container
    borderWidth: 1,
    borderColor: '#708090', // Border color that matches the theme
  },
  output: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000', // Dark color for text
  },
});

export default App;
