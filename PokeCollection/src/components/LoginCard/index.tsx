import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

import { Input } from "../input";
import { Button } from "../button";
import { Alert } from "../alert";

import { styles } from "./styles";
import { Colors } from "../../constants/colors";

export function LoginCard() {
  const { width } = useWindowDimensions();
  const IS_NARROW = width < 420;

  /* ===== STATES ===== */
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "error" as "success" | "error" | "warning" | "info",
  });

  const { signIn } = useAuth();

  /* LOGIN */
  function validateCredentials() {
    if (name === "estudante" && senha === "1234") {
      signIn(name);

      router.push({
        pathname: "/dashboard",
        params: { username: name },
      });
    } else {
      setAlertData({
        title: "Erro de Login",
        message: "Credenciais inválidas. Tente novamente.",
        type: "error",
      });
      setIsAlertVisible(true);
    }
  }

  /* ANIMAÇÕES */
  const scale = useRef(new Animated.Value(1)).current;
  const border = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onFocus = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }),
      Animated.timing(border, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onBlur = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(border, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const borderColor = border.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inputBorder, Colors.primary],
  });

  const animatedStyle = { borderColor };
  const Avatar = (
    <Animated.Image
      source={{
        uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png",
      }}
      style={[
        styles.avatar,
        { transform: [{ translateY: floatAnim }] },
      ]}
    />
  );

  /* CARD */
  const CardContent = (
    <Animated.View
      style={[
        styles.card,
        IS_NARROW ? styles.cardMobile : styles.cardDesktop,
        { transform: [{ scale }] },
      ]}
    >
      <Text style={styles.title}>PokeCollection</Text>
      <View style={styles.line} />
      <Text style={styles.subtitle}>
        Faça login para acessar a coleção
      </Text>

      {IS_NARROW ? (
        <>
          {/* MOBILE */}
          <View style={styles.avatarCenter}>{Avatar}</View>

          <View style={styles.inputColumn}>
            <Input
              label="EMAIL"
              placeholder=" Informe seu email"
              value={name}
              onChangeText={setName}
              onFocus={onFocus}
              onBlur={onBlur}
              animatedStyle={animatedStyle}
            />

            <Input
              label="SENHA"
              placeholder="Informe sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              onFocus={onFocus}
              onBlur={onBlur}
              animatedStyle={animatedStyle}
            />

            <Button title="Entrar" onPress={validateCredentials} />
          </View>
        </>
      ) : (
        <View style={styles.bodyRow}>
          {/* DESKTOP */}
          {Avatar}

          <View style={styles.inputArea}>
            <Input
              label="EMAIL"
              placeholder="Informe seu email"
              value={name}
              onChangeText={setName}
              onFocus={onFocus}
              onBlur={onBlur}
              animatedStyle={animatedStyle}
            />

            <Input
              label="SENHA"
              placeholder="Informe sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              onFocus={onFocus}
              onBlur={onBlur}
              animatedStyle={animatedStyle}
            />

            <Button title="Entrar" onPress={validateCredentials} />
          </View>
        </View>
      )}
    </Animated.View>
  );

  /* MOBILE SCROLL */
  if (IS_NARROW) {
    return (
      <>
        <ScrollView
          contentContainerStyle={{ paddingVertical: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {CardContent}
        </ScrollView>

        <Alert
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          visible={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
        />
      </>
    );
  }

  return (
    <>
      {CardContent}

      <Alert
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />
    </>
  );
}