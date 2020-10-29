import { useEffect, useRef } from 'react';

export default function useStateEffect(effect, deps) {
    const ref = useRef(deps);

    useEffect(() => {
        ref.current = deps;
    }, deps);

    useEffect(() => {
        return effect(ref);
    }, []);
}
