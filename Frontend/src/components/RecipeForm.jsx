import React, { useEffect } from "react";
import { useFormik } from "formik";
import postRecipeValidationSchema from "../validations/postRecipe-validation";

const DRAFT_KEY = "recipeFormDraft";

function RecipeForm({ initialValues, onSubmit, title = "Share Your Recipe", buttonText = "Publish Recipe", }) {
    const formik = useFormik({
        initialValues:
            initialValues || JSON.parse(localStorage.getItem(DRAFT_KEY)) || {
                title: "",
                description: "",
                img: "",
                time: "",
                servings: "",
                level: "easy",
                category: "Lunch",
                ingredients: [""],
                instructions: [""],
            },

        enableReinitialize: true,

        validate: (values) => {
            const { error } = postRecipeValidationSchema.validate(values, {
                abortEarly: false,
            });

            if (!error) return {};

            const errors = {};
            error.details.forEach((detail) => {
                const path = detail.path[0];
                if (!errors[path]) errors[path] = detail.message;
            });

            return errors;
        },

        onSubmit: async (values) => {
            await onSubmit(values);
            localStorage.removeItem(DRAFT_KEY);
        },
    });


    useEffect(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formik.values));
    }, [formik.values]);

    const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
    const levels = ["easy", "medium", "hard"];

    const addArrayItem = (field) => {
        formik.setFieldValue(field, [...formik.values[field], ""]);
    };

    const removeArrayItem = (field, index) => {
        const newList = formik.values[field].filter((_, i) => i !== index);
        formik.setFieldValue(field, newList.length > 0 ? newList : [""]);
    };

    const handleArrayChange = (field, index, value) => {
        const newList = [...formik.values[field]];
        newList[index] = value;
        formik.setFieldValue(field, newList);
    };

    const handleClearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);

        formik.resetForm({
            values: {
                title: "",
                description: "",
                img: "",
                time: "",
                servings: "",
                level: "easy",
                category: "Lunch",
                ingredients: [""],
                instructions: [""],
            },
        });
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-[550px] flex flex-col gap-5 shadow-2xl mb-10"
        >
            <h2 className="text-3xl font-black text-center text-slate-800 mb-2 uppercase tracking-tight">
                {title}
            </h2>

            {/* Title */}
            <div className="flex flex-col gap-1">
                <input
                    className={`border p-2 rounded outline-amber-400 text-sm ${formik.touched.title && formik.errors.title ? "border-red-500" : ""
                        }`}
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                    <span className="text-red-500 text-[10px]">
                        {formik.errors.title}
                    </span>
                )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <textarea
                    className={`border p-2 rounded outline-amber-400 text-sm h-20 resize-none ${formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : ""
                        }`}
                    name="description"
                    placeholder="Enter Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                    <span className="text-red-500 text-[10px]">
                        {formik.errors.description}
                    </span>
                )}
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1">
                <input
                    className={`border p-2 rounded outline-amber-400 text-sm ${formik.touched.img && formik.errors.img ? "border-red-500" : ""
                        }`}
                    type="text"
                    name="img"
                    placeholder="Paste Img Url"
                    value={formik.values.img}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.img && formik.errors.img && (
                    <span className="text-red-500 text-[10px]">{formik.errors.img}</span>
                )}
            </div>

            {/* Servings and Time */}
            <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-1">
                    <input
                        className={`border border-slate-200 p-3 rounded-xl outline-emerald-500 text-sm w-full transition-all ${formik.touched.servings && formik.errors.servings
                            ? "border-red-500"
                            : "focus:border-emerald-500"
                            }`}
                        type="number"
                        name="servings"
                        placeholder="Servings (e.g. 4)"
                        value={formik.values.servings}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.servings && formik.errors.servings && (
                        <span className="text-red-500 text-[10px] ml-1">
                            {formik.errors.servings}
                        </span>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <input
                        className={`border border-slate-200 p-3 rounded-xl outline-emerald-500 text-sm w-full transition-all ${formik.touched.time && formik.errors.time
                            ? "border-red-500"
                            : "focus:border-emerald-500"
                            }`}
                        type="number"
                        name="time"
                        placeholder="Minutes (e.g. 30)"
                        value={formik.values.time}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.time && formik.errors.time && (
                        <span className="text-red-500 text-[10px] ml-1">
                            {formik.errors.time}
                        </span>
                    )}
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                    <label className="font-bold text-xs uppercase tracking-widest text-slate-500">
                        Ingredients
                    </label>
                    <button
                        type="button"
                        onClick={() => addArrayItem("ingredients")}
                        className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-lg font-black shadow-md hover:bg-emerald-600 transition-colors"
                    >
                        +
                    </button>
                </div>

                {formik.values.ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input
                            className="border border-slate-200 p-3 rounded-xl text-sm outline-emerald-500 flex-1 focus:border-emerald-500 transition-all"
                            type="text"
                            placeholder={`Ingredient ${i + 1}`}
                            value={ing}
                            onChange={(e) =>
                                handleArrayChange("ingredients", i, e.target.value)
                            }
                        />
                        {formik.values.ingredients.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem("ingredients", i)}
                                className="text-red-500 text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Instructions Section */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                    <label className="font-bold text-xs uppercase tracking-widest text-slate-500">
                        Instructions
                    </label>
                    <button
                        type="button"
                        onClick={() => addArrayItem("instructions")}
                        className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-lg font-black shadow-md hover:bg-emerald-600 transition-colors"
                    >
                        +
                    </button>
                </div>

                {formik.values.instructions.map((ins, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input
                            className="border p-2 rounded text-sm outline-amber-400 flex-1"
                            type="text"
                            placeholder={`Step ${i + 1}`}
                            value={ins}
                            onChange={(e) =>
                                handleArrayChange("instructions", i, e.target.value)
                            }
                        />
                        {formik.values.instructions.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem("instructions", i)}
                                className="text-red-500 text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Level and Category */}
            <div className="flex gap-2 font-semibold">
                <select
                    className="border p-2 rounded outline-amber-400 text-sm flex-1 bg-white cursor-pointer"
                    name="level"
                    value={formik.values.level}
                    onChange={formik.handleChange}
                >
                    {levels.map((l) => (
                        <option key={l} value={l}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded outline-amber-400 text-sm flex-1 bg-white cursor-pointer"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>



            <input
                className="bg-emerald-600 py-3 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer shadow-lg mt-4 border-none"
                type="submit"
                value={buttonText}
            />

            <button
                type="button"
                onClick={handleClearDraft}
                className="bg-rose-100 text-rose-700 font-black uppercase tracking-widest rounded-xl py-3 hover:bg-rose-200 transition-all"
            >
                Clear
            </button>
        </form>
    );
}

export default RecipeForm;
