import { Image, Text, TouchableOpacity } from "react-native";

import checkImg from "../../assets/check.png";
import { style } from "./CardTodo.style";

export function CardTodo({ todo, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(todo)}
      onPress={() => onPress(todo)}
      style={style.card}
    >
      <Text
        style={[
          style.txt,
          //Barre le texte si la tachae est complétée
          todo.isCompleted && { textDecorationLine: "line-through" },
        ]}
      >
        {todo.title}
      </Text>
      {/*Affichage de l'image si la tache est complétée */}
      {todo.isCompleted && <Image style={style.img} source={checkImg} />}
    </TouchableOpacity>
  );
}
