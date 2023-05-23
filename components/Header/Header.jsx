//raccourci rf
import { Image, Text } from "react-native";
import { style } from "./Header.style";
import headerLogo from "../../assets/logo.png";

export function Header() {
  return (
    <>
      <Image style={style.img} source={headerLogo} resizeMode="contain" />
      <Text style={style.subtitle}>Tu as problablement un truc à faire !</Text>
    </>
  );
}
