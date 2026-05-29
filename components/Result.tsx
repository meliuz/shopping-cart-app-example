import { useState, useEffect, useCallback } from "react";

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";

import { Product } from "../types";

import AsyncStorage from "@react-native-async-storage/async-storage";

type ResultProps = {
  productList: Product[];
  onPressFinish: () => void;
  onPressLoadCart: (data: Product[]) => void;
};

export function Result({
  productList,
  onPressFinish,
  onPressLoadCart,
}: ResultProps) {
  const [total, setTotal] = useState({
    price: 0,
    cashback: 0,
    totalItens: 0,
  });
  const [formattedPrice, setFormattedPrice] = useState("");
  const [formattedCashback, setFormattedCashback] = useState("");

  useEffect(() => {
    const total = productList.reduce(
      (acc, product) => {
        if (product.inCart) {
          acc.price += product.price;
          acc.cashback += product.price * (product.cashback / 100);
          acc.totalItens += 1;
        }

        return acc;
      },
      { price: 0, cashback: 0, totalItens: 0 }
    );

    const cashbackPtBr = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total.cashback);

    const pricePtBr = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total.price);

    setTotal(total);
    setFormattedPrice(pricePtBr);
    setFormattedCashback(cashbackPtBr);
  }, [productList]);

  const handleFinish = useCallback(() => {
    const itens = productList
      .filter((product) => product.inCart)
      .map((product) => product.name)
      .join("\n");

    Alert.alert(`Obrigado por comprar: \n ${itens}`);
    onPressFinish();
  }, [productList, onPressFinish]);

  const handleSaveCart = useCallback(async () => {
    const jsonValue = JSON.stringify(productList);
    if (!jsonValue) return;
    await AsyncStorage.setItem("cart-data", jsonValue);
    Alert.alert("Carrinho salvo com sucesso!");
  }, [productList]);

  const handleLoadCart = useCallback(async () => {
    const jsonValue = await AsyncStorage.getItem("cart-data");
    const parsed = jsonValue != null ? JSON.parse(jsonValue) : null;
    parsed && onPressLoadCart(parsed);
  }, [productList]);

  return (
    <View style={styles.container}>
      <Text>Total de itens: {total.totalItens}</Text>
      <Text>Total: {formattedPrice}</Text>
      <Text>Total de cashback: {formattedCashback}</Text>
      <Pressable
        style={styles.finishBtn}
        onPress={handleFinish}
        disabled={!total.totalItens}
      >
        <Text>Finalizar Compra</Text>
      </Pressable>
      <Pressable
        style={styles.saveBtn}
        onPress={handleSaveCart}
        disabled={!total.totalItens}
      >
        <Text>Salvar Carrinho</Text>
      </Pressable>
      <Pressable style={styles.loadBtn} onPress={handleLoadCart}>
        <Text>Carregar Carrinho</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  finishBtn: {
    backgroundColor: "#43A047",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#43A047",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
  },
  loadBtn: {
    backgroundColor: "#43A047",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
  },
});
