import React, { useEffect, useState } from 'react'
import { useAuth } from '../../navigation/AuthContext'
import sqliteService from '../services/sqliteService';
import colors from '../constants/colors';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';

const emptyForm = {
    direccion: '',
    correo: '',
    facultad: '',
    programa: '',
    otros:'',
}

const AcademicForm = ({onClose}) => {
    const {user} = useAuth();
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await sqliteService.getAcademicById(user.uid); 
                if (mounted) {
                    if (data) {
                        setForm({
                            direccion: data.direccion || '',
                            correo: data.correo || '',
                            facultad: data.facultad || '',
                            programa: data.programa || '',
                            otros: data.otros || '',
                        });
                    } else {
                        setForm(emptyForm);
                    }
                }
            } catch (error) {
                console.warn('ERROR CARGANDO LOS DATOS ... DE SQLITE', error);
                Alert.alert('Error de carga', 'No fue posible cargar los datos de la base de datos local');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [user]);

    const handleChange = (key, value) => 
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        if (!user) return Alert.alert('Error', 'Usuario no autenticado');
        try {
            setLoading(true);
            await sqliteService.upsertAcademic(user.uid, form);
            Alert.alert('Guardado', 'Datos académicos guardados localmente');
            onClose(); 
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'No se pudo guardar');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!user) return;
        Alert.alert(
            'Eliminar',
            '¿Deseas eliminar los datos académicos locales?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await sqliteService.deleteAcademicById(user.uid);
                            setForm(emptyForm);
                            Alert.alert('Eliminado', 'Datos académicos eliminados');
                            onClose();
                        } catch (e) {
                            console.error(e);
                            Alert.alert('Error', 'No se pudo eliminar');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.principal} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Datos Académicos</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Dirección</Text>
            <TextInput 
                style={styles.input} 
                value={form.direccion} 
                onChangeText={t => handleChange('direccion', t)} 
                placeholder="Dirección" 
            />

            <Text style={styles.label}>Correo</Text>
            <TextInput 
                style={styles.input} 
                value={form.correo} 
                onChangeText={t => handleChange('correo', t)} 
                placeholder="Correo académico" 
                keyboardType="email-address" 
            />

            <Text style={styles.label}>Facultad</Text>
            <TextInput 
                style={styles.input} 
                value={form.facultad} 
                onChangeText={t => handleChange('facultad', t)} 
                placeholder="Facultad" 
            />

            <Text style={styles.label}>Programa</Text>
            <TextInput 
                style={styles.input} 
                value={form.programa} 
                onChangeText={t => handleChange('programa', t)} 
                placeholder="Programa" 
            />

            <Text style={styles.label}>Otros</Text>
            <TextInput 
                style={[styles.input, styles.multiline]} 
                value={form.otros} 
                onChangeText={t => handleChange('otros', t)} 
                placeholder="Observaciones" 
                multiline 
            />

            <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, styles.save]} 
                    onPress={handleSave} 
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color={colors.thin} /> : <Text style={styles.buttonText}>Guardar</Text>}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.delete]} 
                    onPress={handleDelete} 
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 6,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loaderContainer: {
        padding: 12,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.principal,
    },
    closeButton: {
        padding: 5,
        borderRadius: 15,
        backgroundColor: '#eee',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.subtle,
    },
    label: {
        fontSize: 13,
        color: colors.subtle,
        marginTop: 8,
        marginBottom: 2,
    },
    input: {
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 14,
    },
    multiline: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    save: {
        backgroundColor: colors.variante6,
    },
    delete: {
        backgroundColor: colors.error,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default AcademicForm;