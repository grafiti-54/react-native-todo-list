import { Text, TouchableOpacity, View } from "react-native";
import { style } from "./TabBottomMenu.style";
export function TabBottomMenu({ selectedTabName, onPress, todoList }) {
  
    //Tri des différents status (Tout, en cours, terminé) pour les éléments de la liste.
  const countByStatus = todoList.reduce(
    (acc, todo) => {
        todo.isCompleted? acc.done++ : acc.inProgress++
      return acc;
    },
    { all: todoList.length, inProgress: 0, done: 0 }
  );
  //console.log(countByStatus);

  function getTextStyle(tabName) {
    return {
      fontWeight: "bold",
      color: tabName === selectedTabName ? "#2F76E5" : "black",
    };
  }
  return (
    <View style={style.container}>
      <TouchableOpacity onPress={() => onPress("Tout")}>
        <Text style={getTextStyle("Tout")}>Tout({countByStatus.all})</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress("En cours")}>
        <Text style={getTextStyle("En cours")}>En cours({countByStatus.inProgress})</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress("Terminé")}>
        <Text style={getTextStyle("Terminé")}>Terminé({countByStatus.done})</Text>
      </TouchableOpacity>
    </View>
  );
}
