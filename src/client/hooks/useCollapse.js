import { useState, useEffect, useRef } from 'react';
import { useSpring } from 'react-spring';

export default function useCollapse(initialOpen = false) {
    const [open, setOpen] = useState(initialOpen);
    const [{ height }, set] = useSpring(() => ({ height: initialOpen ? 'auto' : 0, config: { mass: 1, tension: 300 } }));
    const mountRef = useRef(false);
    const ref = useRef(null);

    useEffect(() => {
        console.log('useeffect');
        if (mountRef.current) {
            const curHeight = ref.current.offsetHeight;
            set({
                reset: true,
                from: { height: open ? 0 : curHeight },
                to: async (next) => {
                    await next({ height: open ? curHeight : 0 });
                    open && (await next({ height: 'auto' }));
                }
            });
        } else mountRef.current = true;
    }, [open]);

    return { ref, open, setOpen, height };
}
