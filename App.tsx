import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Switch } from 'react-native';

const App = () => {
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const showMessage = () => {
    setMessage('Hello, welcome to my first React Native app!');
  };

  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
        My Simple App
      </Text>
      <Button title="Press Me" onPress={showMessage} color={darkMode ? "#ff6347" : "#1e90ff"} />
      {message ? (
        <Text style={[styles.message, darkMode ? styles.darkText : styles.lightText]}>
          {message}
        </Text>
      ) : null}
      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, darkMode ? styles.darkText : styles.lightText]}>
          Dark Mode
        </Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 18,
  },
});

export default App;
