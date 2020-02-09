db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_info", "settings", "account_status"],
            properties: {
                user_info: {
                    bsonType: "object",
                    required: ["name", "email", "password", "role", "joined_date"],
                    properties: {
                        name: {
                            bsonType: "string",
                            minLength: 1,
                            maxLength: 255
                        },
                        email: {
                            bsonType: "string",
                            maxLength: 255
                        },
                        password: {
                            bsonType: "string"
                        },
                        role: {
                            enum: ["Admin", "User"]
                        },
                        joined_date: {
                            bsonType: "date"
                        },
                        img: {
                            bsonType: "string"
                        }
                    }
                },
                settings: {
                    bsonType: "object"
                },
                account_status: {
                    enum: ["Active", "Suspended", "Deleted"]
                },
                sorter_results: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["name", "date", "results"],
                        properties: {
                            sorter_id: {
                                bsonType: "objectId"
                            },
                            name: {
                                bsonType: "object",
                                patternProperties: {
                                    "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                        bsonType: "string",
                                        maxLength: 255
                                    }
                                }
                            },
                            date: {
                                bsonType: "date"
                            },
                            results: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    required: ["name", "position"],
                                    properties: {
                                        name: {
                                            bsonType: "object",
                                            patternProperties: {
                                                "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                                    bsonType: "string",
                                                    maxLength: 255
                                                }
                                            }
                                        },
                                        img: {
                                            bsonType: "string"
                                        },
                                        position: {
                                            bsonType: "int",
                                            minimum: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                sorter_progress: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["sorter_id", "state"],
                        properties: {
                            sorter_id: {
                                bsonType: "objectId"
                            },
                            state: {
                                bsonType: "object"
                            }
                        }
                    }
                },
                favorites: {
                    bsonType: "array",
                    items: {
                        bsonType: "objectId"
                    }
                }
            }
        }
    }
})