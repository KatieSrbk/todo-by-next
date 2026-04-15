import styles from './styles.module.scss';

const AddSection = () => {
  return (
    <div className={styles.addSection}>
      <input
        className={styles.addInput}
        type='text'
        placeholder='Напиши задачу'
      />
      <button className={styles.addButton}>Добавить</button>
    </div>
  );
};

export default AddSection;
