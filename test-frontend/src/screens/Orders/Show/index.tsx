import React, { useEffect } from "react";
import OrdersShowStore from "./store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import styles from "./styles.m.styl";
import OrderItem from './components/Item'

type ShowParams = {
  id: string;
};

const OrdersShow = observer(
  (): JSX.Element => {
    const [state] = React.useState(new OrdersShowStore());

    useEffect(() => {
      if (state.initialized) return;
      state.initialize();
    });

    return (
      <div className={styles.screenWrapper}>
        <div className={styles.screen}>
        {state.loading && <span>Loading...</span>}
        {!state.loading && (
          <div className={styles.items}>
            {state.order?.items.map(item => (
              <OrderItem item={item} key={item.id} />
            ))}
          </div>
        )}
        </div>
      </div>
    );
  }
);

export default OrdersShow;
