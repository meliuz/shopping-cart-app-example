import { useCallback } from "react";

import { View, Text, Image, StyleSheet, Pressable } from "react-native";

import type { Product } from "../types";

type ProductItemProps = Product & {
  onPressBuy: (id: number) => void;
  onPressRemove: (id: number) => void;
};

export function ProductItem({
  id,
  name,
  price,
  cashback,
  image,
  inCart,
  onPressBuy,
  onPressRemove,
}: ProductItemProps) {
  const ptBrPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const handlePressBuy = useCallback(() => {
    onPressBuy(id);
  }, [id, onPressBuy]);

  const handlePressRemove = useCallback(() => {
    onPressRemove(id);
  }, [id, onPressRemove]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{name}</Text>
        <Text style={styles.description}>{ptBrPrice}</Text>
        <Text style={styles.description}>Cashback {cashback}%</Text>
        {inCart && (
          <Text style={styles.description}>Adicionado ao carrinho</Text>
        )}
      </View>
      {inCart ? (
        <Pressable onPress={handlePressRemove} style={styles.removeBtn}>
          <Text style={styles.buttonText}>Remover</Text>
        </Pressable>
      ) : (
        <Pressable onPress={handlePressBuy} style={styles.buyBtn}>
          <Text style={styles.buttonText}>Comprar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    flexDirection: "row",
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  buyBtn: {
    backgroundColor: "#3F51B5",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    width: 100,
    textAlign: "center",
  },
  removeBtn: {
    backgroundColor: "#F50057",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    width: 100,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  description: {
    marginBottom: 5,
  },
});
