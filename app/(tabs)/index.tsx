import { useState, useCallback } from "react";

import { ScrollView, SafeAreaView } from "react-native";

import ProductListData from "../../data/products.json";

import { ProductItem } from "../../components/ProductItem";
import { Result } from "../../components/Result";

import type { Product } from "../../types";

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>(ProductListData);

  const addToCart = useCallback(
    (id: number) => {
      const index = products.findIndex((product) => product.id === id);

      if (index !== -1) {
        const newProduct = { ...products[index], inCart: true };
        setProducts((p) => {
          const newProducts = [...p];
          newProducts[index] = newProduct;
          return newProducts;
        });
      }
    },
    [products]
  );

  const removeFromCart = useCallback(
    (id: number) => {
      const index = products.findIndex((product) => product.id === id);

      if (index !== -1) {
        const newProduct = { ...products[index], inCart: false };
        setProducts((p) => {
          const newProducts = [...p];
          newProducts[index] = newProduct;
          return newProducts;
        });
      }
    },
    [products]
  );

  const finishPurchase = useCallback(() => {
    setProducts(ProductListData);
  }, []);

  const loadCart = useCallback((data: Product[]) => {
    setProducts(data);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {products.map((product: Product, index) => (
          <ProductItem
            key={index}
            onPressBuy={addToCart}
            onPressRemove={removeFromCart}
            {...product}
          />
        ))}
        <Result
          productList={products}
          onPressFinish={finishPurchase}
          onPressLoadCart={loadCart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
