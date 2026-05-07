import {
  View,
  Text,
  Image,
  Animated,
  ImageSourcePropType,
  Pressable,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';

import { Alert } from '@/components/alert';

interface CardProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export function Card({ title, description, image }: CardProps) {
  const [visible, setVisible] = useState(false);

  // animação flutuante da imagem
  const floatAnim = useRef(new Animated.Value(0)).current;

  // animação leve do card
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // imagem flutuando
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // card respirando
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // pega o tipo corretamente
  const tipo = description.split(' ').pop();

  return (
    <Animated.View
      style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
    >
      {/* IMAGEM */}
      <View style={styles.imageContainer}>
        <Animated.Image
          source={image}
          style={[
            styles.image,
            { transform: [{ translateY: floatAnim }] },
          ]}
        />
      </View>

      {/* TEXTO */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* BOTÃO BONITO */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Ver detalhes</Text>
      </Pressable>

      {/* ALERT */}
      <Alert
        title={`🔎 ${title}`}
        message={`📌 ${description}

        ⭐ Tipo: ${tipo}
        🔥 Nível: Intermediário
        🎯 Habilidade: Especial`}
                type="info"
                visible={visible}
                onClose={() => setVisible(false)}
      />
    </Animated.View>
  );
}