import { useState } from 'react'
import styles from './sumbit_button.module.scss'
import { motion } from 'framer-motion'
export default function SubmitButton() {

    const [submit, setSubmit] = useState(false);

    const Submit = () => {
        setSubmit(true);
        setTimeout(() => {
            setSubmit(false);
        }, 6000);
    }

    return (
        <div className={styles.main}>
            <motion.button className={!submit ? styles.button : styles.button + ' ' + styles.button_active}
                onClick={() => !submit && Submit()}
                animate={submit ? { width: 40 } : { width: 100 }}
            >
                <motion.div
                    animate={submit ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                >
                    submit
                </motion.div>
            </motion.button>
        </div>
    )

}