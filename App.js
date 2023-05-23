import { Alert, ScrollView, Text } from "react-native";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { style } from "./App.style.js";
import { Header } from "./components/Header/Header.jsx";
import { CardTodo } from "./components/CardTodo/CardTodo.jsx";
import { useEffect, useState } from "react";
import { TabBottomMenu } from "./components/TabBottomMenu/TabBottomMenu.jsx";
import { ButtonAdd } from "./components/ButtonAdd/ButtonAdd.jsx";
import Dialog from "react-native-dialog"; // npm i react-native-dialog      https://www.npmjs.com/package/react-native-dialog
import uuid from "react-native-uuid"; //npm i uuidv4   https://www.npmjs.com/package/uuidv4
//npx expo install @react-native-async-storage/async-storage  https://docs.expo.dev/versions/latest/sdk/async-storage/
import AsyncStorage from "@react-native-async-storage/async-storage";
//!FAKE DATA
// const TODO_LIST = [
//   { id: 1, title: "Sortir le chien", isCompleted: true },
//   { id: 2, title: "Aller chez le garagiste", isCompleted: false },
//   { id: 3, title: "Faire les courses", isCompleted: true },
//   { id: 4, title: "Appeler le vétérinaire", isCompleted: true },
//   { id: 5, title: "Sortir le chien", isCompleted: true },
//   { id: 6, title: "Aller chez le garagiste", isCompleted: false },
//   { id: 7, title: "Faire les courses", isCompleted: true },
//   { id: 8, title: "Appeler le vétérinaire", isCompleted: true },
// ];

let isFirstRender = true;
let isLoadUpdate = false;

export default function App() {
  //const [todoList, setTodoList] = useState(TODO_LIST); //!FAKE DATA
  const [todoList, setTodoList] = useState([]);
  const [selectedTabName, setSelectedTabName] = useState("Tout");
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  //Fonction de chargement des données sur le téléphone lors du démarrage de l'application.
  useEffect(() => {
    loadTodoList();
  }, []); // tableau vide utilisé pour le 1er rendering.

  //Sauvegarde de la todoList lors de chaque changement hors lors du 1er chargement à l'ouverture de l'application.
  useEffect(() => {
    if (isLoadUpdate) {
      isLoadUpdate = false;
    } else {
      if (!isFirstRender) {
        saveTodoList();
      } else {
        isFirstRender = false;
      }
    }
  }, [todoList]);

  //Sauvegarde des données sur le téléphone
  async function saveTodoList() {
    try {
      //@todolist nom(clé) que l'on donne a la sauvegarde sur le téléphone.
      await AsyncStorage.setItem("@todoList", JSON.stringify(todoList));
    } catch (err) {
      alert("Erreur de sauvegarde" + err);
    }
  }

  //Fonction de chargement des données sur le téléphone.
  async function loadTodoList() {
    try {
      const stringifyTodoList = await AsyncStorage.getItem("@todoList");
      if (stringifyTodoList !== null) {
        const parsedTodoList = JSON.parse(stringifyTodoList);
        isLoadUpdate = true;
        setTodoList(parsedTodoList);
      } else {
        setTodoList([]);
      }
    } catch (err) {
      alert("Erreur de chargement" + err);
    }
  }

  //Fonction d'affichage selon le filtre utilisé dans le footer.
  function getFilteredList() {
    switch (selectedTabName) {
      case "Tout":
        return todoList;
      case "En cours":
        //return todoList.filter(todo => !todo.isCompleted)
        return todoList.filter((todo) => todo.isCompleted === false);
      case "Terminé":
        return todoList.filter((todo) => todo.isCompleted);
    }
  }

  //Fonction de modification du status d'une tache.
  function updateTodo(todo) {
    // Mise à jour de la tache.
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    //Récupération de l'index de la todo selectionnée dans la liste selon son id.
    const indexToUpdate = todoList.findIndex(
      (todo) => todo.id === updatedTodo.id
    );

    //Copie du tableau de todoliste
    const updatedTodoList = [...todoList];
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }

  //Fonction de suppression d'une tache.
  function deleteTodo(todoToDelete) {
    Alert.alert("Suppression", " Supprimer cette tâche ?", [
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          setTodoList(todoList.filter((todo) => todo.id !== todoToDelete.id));
          //console.log(todoToDelete);
        },
      },
      {
        text: "Annuler",
        style: "cancel",
      },
    ]);
  }

  //Fonction d'affichage de la liste complete des taches.
  function renderTodoList() {
    return getFilteredList().map((todo) => (
      <View tyle={style.cardItem} key={todo.id}>
        <CardTodo onLongPress={deleteTodo} onPress={updateTodo} todo={todo} />
      </View>
    ));
  }

  //Affichage d'un popup pour ajouter une tache.
  function showAddDialog() {
    setIsAddDialogVisible(true);
  }

  //Function d'ajout d'une tache dans la liste.
  function addTodo() {
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
    setIsAddDialogVisible(false);
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={style.app}>
          <View style={style.header}>
            <Header />
          </View>
          <View style={style.body}>
            <ScrollView>{renderTodoList()}</ScrollView>
          </View>
          <ButtonAdd onPress={showAddDialog} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={style.footer}>
        <TabBottomMenu
          todoList={todoList}
          onPress={setSelectedTabName}
          selectedTabName={selectedTabName}
        />
      </View>
      <Dialog.Container
        visible={isAddDialogVisible}
        onBackdropPress={() => setIsAddDialogVisible(false)} // clic en dehors de la zone de dialog pour la supprimer
      >
        <Dialog.Title>Créer une tâche</Dialog.Title>
        <Dialog.Description>
          Saisir le nom de votre nouvelle tâche
        </Dialog.Description>
        <Dialog.Input onChangeText={setInputValue} />
        <Dialog.Button
          disabled={inputValue.trim().length === 0}
          label="Créer"
          onPress={addTodo}
        />
      </Dialog.Container>
    </>
  );
}
