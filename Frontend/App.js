import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tasks')
      .then((response) => setTasks(response.data.tasks))
      .catch((error) => console.error(error));
  }, []);

  const addTask = () => {
    axios.post('http://127.0.0.1:5000/tasks', { task })
      .then((response) => {
        console.log(response.data.message);
        setTask('');
        setTasks([...tasks, task]);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <Text>Todo List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '100px',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    width: '80%',
  },
});

export default App;